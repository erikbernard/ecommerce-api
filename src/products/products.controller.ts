import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, HttpException, BadRequestException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { QueryProductDto } from './dto/query-product.dto';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService
  ) { }

  @Get()
  async findAll(@Query() query: QueryProductDto): Promise<PaginatedResponse<Product>> {
    try {
      const paginationAndFilters = await this.productsService.findAll(query);
      return {
        ...paginationAndFilters,
        offset: paginationAndFilters.offset ?? 0,
        limit: paginationAndFilters.limit ?? 0,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productsService.findOne(id);
  }

}
