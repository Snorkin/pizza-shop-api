import { JwtService } from '@nestjs/jwt';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from './userToken.entity';
import { Repository } from 'typeorm';
import { User } from '../users.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(UserToken)
    private userTokenRepository: Repository<UserToken>,
    private JwtService: JwtService
  ) {}

  generateTokens() {
    const accessToken = this.JwtService.sign(
      {},
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '30m',
      }
    );
    const refreshToken = this.JwtService.sign(
      {},
      {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '30d',
      }
    );
    return { accessToken, refreshToken };
  }

  async saveToken(user: User, refreshToken) {
    const tokenUpdate = await this.userTokenRepository.findOne({
      where: { user: user },
    });
    if (tokenUpdate) {
      tokenUpdate.refreshToken = refreshToken;
      this.userTokenRepository.save(tokenUpdate);
      return tokenUpdate;
    }
    const token = await this.userTokenRepository.create({
      user: user,
      refreshToken: refreshToken,
    });
    this.userTokenRepository.save(token);
    return token;
  }

  async removeToken(token) {
    const userToken = await this.userTokenRepository.findOne({
      where: { refreshToken: token },
    });
    if (userToken) {
      return await this.userTokenRepository.remove(userToken);
    }
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new HttpException(
        'Отсутствует токен для обновления',
        HttpStatus.BAD_REQUEST
      );
    }
    const token = await this.validateRefreshToken(refreshToken);
    const tokenDb = await this.findToken(refreshToken);

    if (!token || !tokenDb) {
      throw new HttpException(
        'Отсутствует токен для обновления в базе данных либо токен не действителен',
        HttpStatus.BAD_REQUEST
      );
    }
    const newTokens = this.generateTokens();
    tokenDb.refreshToken = newTokens.refreshToken;
    await this.userTokenRepository.save(tokenDb);
    return newTokens;
  }

  async validateAccessToken(token) {
    try {
      await this.JwtService.verify(token.refreshToken, {
        secret: process.env.JWT_ACCESS_SECRET,
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  async validateRefreshToken(token) {
    try {
      await this.JwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async findToken(token) {
    const selectedToken = await this.userTokenRepository.findOne({
      where: { refreshToken: token },
    });

    if (selectedToken) {
      return selectedToken;
    }
    return null;
  }

  async findUserByToken(token) {
    const selectedUser = await this.userTokenRepository
      .createQueryBuilder('userToken')
      .leftJoinAndSelect('userToken.user', 'user')
      .where('userToken.refreshToken = :rToken', { rToken: token })
      .getOne();
    if (selectedUser) {
      return selectedUser;
    }
  }
}
