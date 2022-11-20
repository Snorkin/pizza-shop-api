import { OrderController } from './order.controller';
import { OrderContent } from './orderContent/orderContent.entity';
import { Order } from './order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { User } from '@app/users/users.entity';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [TypeOrmModule.forFeature([Order, OrderContent, User])],
})
export class OrderModule {}
