import { UserServiceClient } from '@app/common';
import { Metadata } from '@grpc/grpc-js';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  private userGrpcService: UserServiceClient;
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userGrpcService =
      this.userClient.getService<UserServiceClient>('UserService');
  }

  userMe(username: string) {
    const metadata = new Metadata();
    return this.userGrpcService.userMe({ username }, metadata);
  }

  userRegister(username: string) {
    const metadata = new Metadata();
    return this.userGrpcService.userRegister({ username }, metadata);
  }
}
