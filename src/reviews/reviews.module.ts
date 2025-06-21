import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';
import { Review } from './entities/review.entity';
import { Order } from 'src/orders/entities/order.entity';
import { OrderItem } from 'src/orders/entities/order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, User, Product, Order, OrderItem])
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule { }
