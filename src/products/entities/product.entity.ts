import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Unique } from 'typeorm';
import { EProductProvider } from 'src/common/enums/EProductProvider';
import { Review } from 'src/reviews/entities/review.entity';
import { OrderItem } from 'src/orders/entities/order-item.entity';
@Entity({ name: 'products' })
@Unique(['provider', 'provider_id'])
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: EProductProvider,
  })
  provider: EProductProvider;

  @Column({ name: 'provider_id' })
  provider_id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2, transformer: { from: (val) => parseFloat(val), to: (val) => val } })
  price: number;

  @Column()
  image: string;

  @Column('decimal', { precision: 10, scale: 2, transformer: { from: (val) => parseFloat(val), to: (val) => val } })
  discountValue: number;

  @Column({ default: false })
  hasDiscount: boolean;

  @Column({ default: 10 })
  stock: number;

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => Review, review => review.product)
  reviews: Review[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}