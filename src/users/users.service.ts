import { Injectable } from '@nestjs/common';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = new User();
    Object.assign(user, dto);
    await this.userRepository.save(user);

    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository.find();
    return users;
  }

  async findUserByLogin(loginOrEmail: string) {
    const user = this.userRepository.findOne({
      where: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
    return user;
  }
}
