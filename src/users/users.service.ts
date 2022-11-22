import { Injectable } from '@nestjs/common';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ActivationLink } from './mail/activationLink.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ActivationLink)
    private linkRepository: Repository<ActivationLink>
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = new User();
    Object.assign(user, { ...dto, activated: false });
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

  async addLink(user: User, link: string) {
    const activationLink = await this.linkRepository.create({
      user: user,
      activationLink: link,
    });
    await this.linkRepository.save(activationLink);
  }

  async activateUser(link) {
    const userByLink = await this.linkRepository
      .createQueryBuilder('activationLink')
      .leftJoinAndSelect('activationLink.user', 'user')
      .where('activationLink.activationLink = :link', { link: link })
      .getOne();
    if (userByLink) {
      userByLink.user.activated = true;
      await this.linkRepository.save(userByLink);
      return '<h1>Вы успешно активировали аккаунт</h1>';
    }
    return '<h1>Ошибка октивации аккаунта</h1>';
  }
}
