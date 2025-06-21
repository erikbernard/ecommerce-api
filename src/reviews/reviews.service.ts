import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import { Order } from 'src/orders/entities/order.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) { }

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    // Verificar se o usuário existe
    const user = await this.userRepository.findOne({
      where: { id: createReviewDto.user_id }
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se o produto existe
    const product = await this.productRepository.findOne({
      where: { id: createReviewDto.product_id }
    });
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }
    // Verificar se o usuário comprou o produto
    const order = await this.orderRepository.findOne({
      where: {
        userId: createReviewDto.user_id,
        items: {
          product: { id: createReviewDto.product_id }
        }
      },
      relations: ['items', 'items.product']
    })
    if (!order) {
      throw new BadRequestException('Usuário não comprou este produto');
    }

    // Verificar se o usuário já fez review deste produto
    const existingReview = await this.reviewRepository.findOne({
      where: {
        user_id: createReviewDto.user_id,
        product_id: createReviewDto.product_id
      }
    });
    if (existingReview) {
      throw new BadRequestException('Usuário já fez review deste produto');
    }

    const review = this.reviewRepository.create(createReviewDto);
    return await this.reviewRepository.save(review);
  }

  async findAll(): Promise<Review[]> {
    return await this.reviewRepository.find({
      relations: ['product'],
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['product']
    });

    if (!review) {
      throw new NotFoundException(`Review com ID ${id} não encontrado`);
    }

    return review;
  }

  async findByProduct(productId: number): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: { product_id: productId },
      relations: ['user'],
      order: { created_at: 'DESC' }
    });
  }

  async findByUser(userId: string): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: { user_id: userId },
      relations: ['product'],
      order: { created_at: 'DESC' }
    });
  }

  async update(id: number, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.findOne(id);

    Object.assign(review, updateReviewDto);
    return await this.reviewRepository.save(review);
  }

  async remove(id: number): Promise<void> {
    const review = await this.findOne(id);
    await this.reviewRepository.remove(review);
  }

}