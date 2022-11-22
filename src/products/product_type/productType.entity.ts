import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ProductTypes')
export class ProductType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;
}
