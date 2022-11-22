import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Request } from 'express';
import { JwtAuthGuard } from '@app/auth/jwtAuth.guard';
import { Roles } from '@app/auth/roles.decorator';
import { RoleGuard } from '@app/auth/role.guard';

// @Roles('admin')
// @UseGuards(RoleGuard)
@Controller('/order')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('/createOrder')
  createOrder(@Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(dto);
  }

  @Get('/getOrder')
  getOrder(@Req() req: Request) {
    return this.orderService.findOrder(req);
  }
}
