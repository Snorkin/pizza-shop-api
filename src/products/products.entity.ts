import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ProductType } from './product_type/productType.entity';

export interface imgPizza {
  imgThin: string;
  imgThick: string;
}
export interface imgProduct {
  img: string;
}

export interface pricePizza {
  priceSmall: number;
  priceMedium: number;
  priceLarge: number;
}
export interface priceProduct {
  price: number;
}

export interface weightPizza {
  weightSmall: number;
  weightMedium: number;
  weightLarge: number;
}

export interface weightProduct {
  weight: number;
}

@Entity('Products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'jsonb' })
  img: imgPizza | imgProduct;

  @Column()
  description: string;

  @Column({ type: 'jsonb' })
  price: pricePizza | priceProduct;

  @Column({ type: 'jsonb' })
  weight: weightPizza | weightProduct;

  @Column()
  sells_month: number;

  @Column()
  sells_overall: number;

  @ManyToOne(() => ProductType, (productType) => productType.id)
  @JoinColumn()
  productType: ProductType;
}
