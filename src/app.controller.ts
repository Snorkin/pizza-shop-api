import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('/')
export class AppController {
  @Get('')
  async get(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('refreshToken');
  }
}
