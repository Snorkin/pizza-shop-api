import { AuthService } from './auth.service';
import { CreateUserDto } from './../users/dto/create-user.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from '@app/users/dto/login-user.dto';
import { Request, Response } from 'express';

@ApiTags('Авторизация')
@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(
    @Body() userDto: LoginUserDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const user = await this.authService.login(userDto, req);
    res.cookie('refreshToken', user.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return { accessToken: user.accessToken };
  }

  @Post('/logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return await this.authService.logout(req, res);
  }

  @Post('/registration')
  async registration(
    @Body() userDto: CreateUserDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    return await this.authService.registration(userDto, req, res);
  }

  @Get('/refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const refreshToken = req.cookies.refreshToken;

    const newTokens = await this.authService.refresh(refreshToken);
    res.cookie('refreshToken', newTokens.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    return newTokens;
  }

  @Get('/activate/:link')
  @Redirect('http://localhost:3000/')
  async activation(@Param('link') link: string) {
    return await this.authService.activate(link);
  }
}
