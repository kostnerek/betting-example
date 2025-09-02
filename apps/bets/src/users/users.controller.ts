import {
  SuccessResponse,
  TEST_USER,
  User,
  UserAuthRequest,
  UserIdentityRequest,
  UserServiceController,
  UserServiceControllerMethods,
} from '@app/common';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UsersService } from 'apps/bets/src/users/users.service';
import { from, Observable } from 'rxjs';

@Controller()
@UserServiceControllerMethods()
export class UsersController implements UserServiceController {
  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod()
  userMe(request: UserIdentityRequest): Observable<User> {
    return from(this.usersService.userMe(request.username));
  }

  @GrpcMethod()
  userRegister(request: UserAuthRequest): Observable<SuccessResponse> {
    return from(this.usersService.userRegister(request.username));
  }
}
