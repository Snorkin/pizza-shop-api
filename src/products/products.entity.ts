import { Entity, Column, PrimaryColumn, Generated } from 'typeorm';

@Entity()
export class Product {
  @PrimaryColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'simple-array' })
  @Generated('uuid')
  img: string[];

  @Column()
  description: string;

  @Column({ type: 'simple-array' })
  price: number[];

  @Column({ type: 'simple-array' })
  weight: number[];

  @Column()
  sales_month: number;

  @Column()
  sales_overall: number;
}
