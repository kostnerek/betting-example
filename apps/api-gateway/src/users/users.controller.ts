import { Body, Controller, Get, Post } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { UsersService } from 'apps/api-gateway/src/users/users.service';
import { UserAuthDto } from 'apps/api-gateway/src/users/dto/user-auth.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  userMe(@Body() body: UserAuthDto) {
    return firstValueFrom(this.usersService.userMe(body.username));
  }

  @Post('register')
  userRegister(@Body() body: UserAuthDto) {
    return firstValueFrom(this.usersService.userRegister(body.username));
  }
}
