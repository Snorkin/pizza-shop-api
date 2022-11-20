import { JwtService } from '@nestjs/jwt';
import { UsersService } from './../users/users.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserDto } from '@app/users/dto/login-user.dto';
import { CreateUserDto } from '@app/users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { User } from '@app/users/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService
  ) {}

  async login(userDto: LoginUserDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async registration(userDto: CreateUserDto) {
    const checkLogin = await this.userService.findUserByLogin(userDto.login);
    const checkEmail = await this.userService.findUserByLogin(userDto.email);
    if (checkLogin) {
      throw new HttpException(
        'Пользователь с таким логином уже зарегестрирован',
        HttpStatus.BAD_REQUEST
      );
    }
    if (checkEmail) {
      throw new HttpException(
        'Пользователь с таким email уже зарегестрирован',
        HttpStatus.BAD_REQUEST
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5); //5 - соль
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });
    return this.generateToken(user);
  }
  private async generateToken(user: User) {
    const payload = { email: user.email, id: user.id, role: user.role };
    return {
      token: this.jwtService.sign(payload),
    };
  }
  private async validateUser(userDto: LoginUserDto) {
    const user = await this.userService.findUserByLogin(userDto.login);
    if (user === null) {
      throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST);
    } else {
      const passwordEquals = await bcrypt.compare(
        userDto.password,
        user.password
      );
      if (passwordEquals) {
        return user;
      } else {
        throw new HttpException('Неверный пароль', HttpStatus.BAD_REQUEST);
      }
    }
  }
}
