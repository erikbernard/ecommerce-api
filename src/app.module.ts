import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ProductSyncModule } from './product-sync/product-sync.module';
import appConfig from './common/config/app.config';
import databaseConfig from './common/config/database.config';
import apiProviderConfig from './common/config/apiProvider.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, apiProviderConfig],
    }),
    DatabaseModule,
    ProductsModule,
    OrdersModule,
    ReviewsModule,
    UsersModule,
    ProductSyncModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
