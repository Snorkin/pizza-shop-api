import { Product } from '@app/products/products.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from '../order.entity';

@Entity('OrdersContent')
export class OrderContent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.id, { cascade: true })
  @JoinColumn()
  order: Order;

  @ManyToOne(() => Product, (product) => product.id)
  @JoinColumn()
  product: Product;

  @Column()
  count: number;

  @Column()
  price: number;
}
