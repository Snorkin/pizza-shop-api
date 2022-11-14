import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum enumStatus {
  Pending = 'Pending',
  Payed = 'Payed',
  Done = 'Done',
  Declined = 'Decliened',
}

@Entity('Orders')
export class Orders {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  payment: number;

  @Column()
  status: enumStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
