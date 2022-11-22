import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokenService } from '@app/users/token/token.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const accessToken = authHeader.split(' ')[1];
      const refreshToken = req.cookies.refreshToken;

      if (bearer !== 'Bearer' || !accessToken) {
        throw new HttpException(
          'Пользователь не авторизован1',
          HttpStatus.UNAUTHORIZED
        );
      }

      const accessTokenCheck = await this.tokenService.validateAccessToken(
        accessToken
      );

      if (!accessTokenCheck) {
        const refreshTokenCheck = await this.tokenService.validateRefreshToken(
          refreshToken
        );
        if (!refreshTokenCheck) {
          return false;
        }
        const refreshTokenDb = await this.tokenService.findToken(refreshToken);
        if (refreshTokenDb) {
          return true;
        }
      }
      return false;
    } catch (error) {
      throw new HttpException(
        'Пользователь не авторизован2',
        HttpStatus.UNAUTHORIZED
      );
    }
  }
}
