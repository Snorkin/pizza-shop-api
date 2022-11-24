import { isEmpty } from 'rxjs';

export class CreateUserDto {
  readonly login: string;
  readonly password: string;
  readonly email: string;
  readonly name: string;
  readonly surname: string;
  readonly phone: string;
}
