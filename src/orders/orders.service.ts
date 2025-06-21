import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto, CreateOrderItemDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) { }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Verificar se o usuário existe
    const user = await this.userRepository.findOne({
      where: { id: createOrderDto.userId }
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se todos os produtos existem e calcular total
    let calculatedTotal = 0;
    const validatedItems: CreateOrderItemDto[] = [];

    for (const item of createOrderDto.items) {
      const product = await this.productRepository.findOne({
        where: { id: item.product_id }
      });

      if (!product) {
        throw new NotFoundException(`Produto com ID ${item.product_id} não encontrado`);
      }

      // Verificar estoque se necessário
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Estoque insuficiente para o produto ${product.name}`);
      }

      calculatedTotal += item.price * item.quantity;
      validatedItems.push(item);
    }

    // Verificar se o total calculado bate com o informado
    if (Math.abs(calculatedTotal - createOrderDto.total) > 0.01) {
      throw new BadRequestException('Total informado não confere com o cálculo dos itens');
    }

    // Criar o pedido
    const order = this.orderRepository.create({
      userId: createOrderDto.userId,
      total: createOrderDto.total,
      status: createOrderDto.status || 'pending',
      address: createOrderDto.address,
      payment_method: createOrderDto.payment_method,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Criar os itens do pedido
    const orderItems = validatedItems.map(item =>
      this.orderItemRepository.create({
        order: { id: savedOrder.id } as Order,
        product: { id: item.product_id } as Product,
        quantity: item.quantity,
        price: item.price,
      })
    );

    await this.orderItemRepository.save(orderItems);

    // Atualizar estoque dos produtos
    for (const item of validatedItems) {
      await this.productRepository.decrement(
        { id: item.product_id },
        'stock',
        item.quantity
      );
    }

    return this.findOne(savedOrder.id);
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({
      select: ['id', 'userId', 'total', 'status', 'payment_method', 'items', 'created_at'],
      relations: ['items', 'items.product'],
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      select: ['id', 'userId', 'total', 'status', 'payment_method', 'items', 'created_at'],
      relations: ['items', 'items.product']
    });

    if (!order) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }

    return order;
  }

  async findByUser(userId: string): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { userId },
      relations: ['items', 'items.product'],
      order: { created_at: 'DESC' }
    });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);

    // Só permitir atualização de status e método de pagamento
    if (updateOrderDto.status) {
      order.status = updateOrderDto.status;
    }

    if (updateOrderDto.payment_method) {
      order.payment_method = updateOrderDto.payment_method;
    }

    await this.orderRepository.save(order);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);

    // Só permitir cancelamento se o pedido ainda não foi enviado
    if (order.status === 'shipped' || order.status === 'delivered') {
      throw new BadRequestException('Não é possível cancelar um pedido já enviado ou entregue');
    }

    // Devolver estoque dos produtos
    for (const item of order.items) {
      await this.productRepository.increment(
        { id: item.product.id },
        'stock',
        item.quantity
      );
    }

    await this.orderRepository.remove(order);
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    const order = await this.findOne(id);
    order.status = status;
    await this.orderRepository.save(order);
    return this.findOne(id);
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { status },
      relations: ['user', 'items', 'items.product'],
      order: { created_at: 'DESC' }
    });
  }
}