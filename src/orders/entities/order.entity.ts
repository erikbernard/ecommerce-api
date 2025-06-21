import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn, IsNull } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { OrderItem } from './order-item.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({ default: 'pending' })
  status: string;

  @Column()
  payment_method: string;

  @Column()
  address: string; // Endereço de entrega

  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
  items: OrderItem[];

  @CreateDateColumn()
  created_at: Date;
}
