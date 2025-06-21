import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Product } from './entities/product.entity';
import { QueryProductDto } from './dto/query-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  // async create(createProductDto: CreateProductDto) {
  //   return 'This action adds a new product';
  // }

  async findAll(query: QueryProductDto) {
    const { offset, limit, provider, minPrice, maxPrice, name, hasDiscount, order } = query;

    // Começa a montar o query builder
    let qb: SelectQueryBuilder<Product> = this.productRepository.createQueryBuilder('product');

    // Filtro por provider BR/EU (enum)
    if (provider !== undefined) {
      qb = qb.andWhere('product.provider = :provider', { provider });
    }

    // Filtro por faixa de preço
    if (minPrice !== undefined) {
      qb = qb.andWhere('product.price >= :minPrice', { minPrice });
    }
    if (maxPrice !== undefined) {
      qb = qb.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    // Filtro por nome (LIKE)
    if (name) {
      qb = qb.andWhere('product.name ILIKE :name', { name: `%${name}%` });
    }

    // Filtro por desconto
    if (hasDiscount !== undefined) {
      console.log('Filtro por desconto ativo', hasDiscount);
      qb = qb.andWhere('product.hasDiscount = :hasDiscount', { hasDiscount: hasDiscount });
    }

    // Ordenação por created_at
    qb = qb.orderBy('product.created_at', order);

    // Pagination
    qb = qb.skip(offset).take(limit);

    // Executa query
    const [items, total] = await qb.getManyAndCount();

    return { items, total, offset, limit };
  }

  async findOne(id: number) {
    try {
      return await this.productRepository.findOne({ where: { id } });
    } catch (error) {
      if (!Number.isInteger(id)) {
        throw new BadRequestException('ID must be a number');
      }
    }
  }

}
