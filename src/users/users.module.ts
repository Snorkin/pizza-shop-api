import { MailService } from './mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { TokenService } from './token/token.service';
import { UserToken } from './token/userToken.entity';
import { MailModule } from './mail/mail.module';
import { ActivationLink } from './mail/activationLink.entity';
import { JwtAuthGuard } from '@app/auth/jwtAuth.guard';

@Module({
  controllers: [UsersController],
  providers: [UsersService, TokenService, JwtService, MailService],
  imports: [
    MailModule,
    TypeOrmModule.forFeature([User, UserToken, ActivationLink]),
  ],
  exports: [UsersService, TokenService, MailService],
})
export class UsersModule {}
