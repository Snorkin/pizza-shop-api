import { OrderContent } from './orderContent/orderContent.entity';
import { User } from '@app/users/users.entity';
import { HttpException, HttpStatus, Injectable, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(OrderContent)
    private orderContentRepository: Repository<OrderContent>
  ) {}

  async createOrder(dto: CreateOrderDto) {
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
    });
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    const newOrder = await this.orderRepository.create({
      user: user,
      price: dto.price,
      status: dto.status,
      address: dto.address,
      comment: dto.comment,
    });
    this.orderRepository.save(newOrder);

    dto.items.map(async (item) => {
      const orderContent = await this.orderContentRepository.create({
        order: newOrder,
        product: item.id,
        count: item.count,
        price: item.price,
      });
      this.orderContentRepository.save(orderContent);
    });
  }

  async findOrder({ id }) {
    console.log(id);

    const order = this.orderContentRepository
      .createQueryBuilder('orderContent')
      .leftJoinAndSelect('orderContent.order', 'order')
      .leftJoinAndSelect('orderContent.product', 'product')
      .where(`order.userId = :uid`, { uid: id })
      .andWhere('order.status != :status', { status: 'done' })
      .getMany();
    return order;
  }
}
