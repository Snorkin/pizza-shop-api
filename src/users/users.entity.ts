import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum enumRole {
  Admin = 'Admin',
  User = 'User',
  Worker = 'Worker',
}

@Entity('Users')
export class User {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Login1',
    description: 'Уникальный логин пользователя',
  })
  @Column({ unique: true })
  login: string;

  @ApiProperty({ example: 'Password1', description: 'Пароль пользователя' })
  @Column()
  password: string;

  @ApiProperty({
    example: 'email@test.com',
    description: 'Уникальный почтовый адресс пользователя',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 'Name1', description: 'Имя пользователя' })
  @Column()
  name: string;

  @ApiProperty({ example: 'Surname1', description: 'Фамилия пользоватея' })
  @Column()
  surname: string;

  @ApiProperty({
    example: '8-800-555-35-35',
    description: 'Номер телефона пользователя',
  })
  @Column()
  phone: string;

  @ApiProperty({ example: 'Admin', description: 'Admin | User | Worker' })
  @Column()
  role: enumRole;

  @Column()
  activated: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
