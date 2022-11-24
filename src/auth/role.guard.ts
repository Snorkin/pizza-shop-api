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
import { Reflector } from '@nestjs/core';
import { rolesKey } from './roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride(rolesKey, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    const bearer = authHeader.split(' ')[0];
    const accessToken = authHeader.split(' ')[1];
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);

    if (bearer !== 'Bearer' || !accessToken) {
      throw new HttpException(
        'У вас недостаточно доступа1',
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
        const tokenUser = await this.tokenService.findUserByToken(refreshToken);
        if (tokenUser && requiredRoles.includes(tokenUser.user.role))
          return true;
      }
    }
    return false;
  }
}
