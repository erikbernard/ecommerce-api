import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProductSyncController } from './product-sync.controller';
import { ProductSyncService } from './product-sync.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]), // Importa o repositório de Produto
    HttpModule, // Módulo para fazer requisições HTTP
  ],
  controllers: [ProductSyncController],
  providers: [ ProductSyncService]
})
export class ProductSyncModule {}
