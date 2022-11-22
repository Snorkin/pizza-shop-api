import { OrderController } from './order.controller';
import { OrderContent } from './orderContent/orderContent.entity';
import { Order } from './order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { User } from '@app/users/users.entity';
import { UsersModule } from '@app/users/users.module';
import { JwtAuthGuard } from '@app/auth/jwtAuth.guard';
import { RoleGuard } from '@app/auth/role.guard';

@Module({
  controllers: [OrderController],
  providers: [OrderService, JwtAuthGuard, RoleGuard],
  imports: [TypeOrmModule.forFeature([Order, OrderContent, User]), UsersModule],
})
export class OrderModule {}
