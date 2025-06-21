import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Product } from 'src/products/entities/product.entity';

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  rating: number;

  @Column('text', { nullable: true })
  comment: string;

  @ManyToOne(() => User, user => user.reviews)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Product, product => product.reviews)
  @JoinColumn({ name: 'product_id' }) // Usa a coluna product_id
  product: Product;

  @Column()
  user_id: string;

  @Column()
  product_id: number; // Tipo ajustado para number

  @CreateDateColumn()
  created_at: Date;
}