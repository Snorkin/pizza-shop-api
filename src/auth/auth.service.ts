import { UsersService } from './../users/users.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginUserDto } from '@app/users/dto/login-user.dto';
import { CreateUserDto } from '@app/users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

import { TokenService } from '@app/users/token/token.service';
import { Request, Response } from 'express';
import * as uuid from 'uuid';
import { MailService } from '@app/users/mail/mail.service';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private tokenService: TokenService,
    private mailService: MailService
  ) {}

  async login(userDto: LoginUserDto, req: Request) {
    const user = await this.validateUser(userDto);
    const tokens = await this.tokenService.generateTokens();
    await this.tokenService.saveToken(user, tokens.refreshToken, req.ip);
    return {
      ...user,
      ...tokens,
    };
  }

  async logout(req: Request, res: Response) {
    const { refreshToken } = req.cookies;
    res.clearCookie('refreshToken');
    return await this.tokenService.removeToken(refreshToken);
  }

  async registration(userDto: CreateUserDto, req: Request, res: Response) {
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
    const hashPassword = await bcrypt.hash(
      userDto.password,
      Number(process.env.HASH_SALT)
    );
    const activationLink = uuid.v4();
    const user = await this.userService.createUser({
      ...userDto,
      password: hashPassword,
    });
    await this.userService.addLink(user, activationLink);
    // await this.mailService.sendActivationMail(
    //   user.email,
    //   `http://localhost:5000/auth/activate/${activationLink}`
    // );
    const tokens = this.tokenService.generateTokens();
    this.tokenService.saveToken(user, tokens.refreshToken, req.ip);
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return {
      userId: user.id,
      login: user.login,
      email: user.email,
      activated: user.activated,
      ...tokens,
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

  async activate(link) {
    const user = await this.userService.activateUser(link);
    return user;
  }

  async refresh(req) {
    const token = await this.tokenService.refresh(req);
    return token;
  }
}
