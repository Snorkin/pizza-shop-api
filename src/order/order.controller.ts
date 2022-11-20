import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './order.entity';
import { createBrotliDecompress } from 'zlib';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('/order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('/createOrder')
  createOrder(@Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(dto);
  }

  @Get('/getOrder')
  getOrder(@Query() query) {
    return this.orderService.findOrder(query);
  }
}
