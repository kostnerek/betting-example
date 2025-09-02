import {
  GrpcErrors,
  User as GrpcUser,
  Bet as GrpcBet,
  SuccessResponse,
} from '@app/common';
import { Injectable } from '@nestjs/common';
import { GamesService } from 'apps/bets/src/games/games.service';
import { UsersDao } from 'apps/bets/src/users/users.dao';
import { Bet, User } from 'generated/prisma/bets';

@Injectable()
export class UsersService {
  constructor(
    private readonly dao: UsersDao,
    private readonly gamesService: GamesService,
  ) {}

  async userMe(username: string): Promise<GrpcUser> {
    const user = await this.dao.findUserByUsername(username);
    if (!user) {
      throw GrpcErrors.notFound('User');
    }
    const userBetsGameIds = user.bets.map((bet) => bet.gameId);
    const games = await this.gamesService.gameListByIds(userBetsGameIds);

    const userBets: GrpcBet[] = user.bets.map((bet) => ({
      ...bet,
      game: games.games.find((game) => game.id === bet.gameId) ?? null,
    }));
    return {
      username: user.username,
      id: user.id,
      balance: user.balance,
      bets: userBets,
    };
  }

  async userById(userId: string): Promise<User & { bets: Bet[] }> {
    const user = await this.dao.findUserById(userId);

    if (!user) {
      throw GrpcErrors.notFound('User');
    }
    return user;
  }

  async userByUsername(username: string): Promise<User & { bets: Bet[] }> {
    const user = await this.dao.findUserByUsername(username);

    if (!user) {
      throw GrpcErrors.notFound('User');
    }
    return user;
  }

  async userSetBalance(userId: string, balance: number): Promise<User> {
    const user = await this.dao.findUserById(userId);
    if (!user) {
      throw GrpcErrors.notFound('User');
    }
    return this.dao.updateUserBalance(userId, balance);
  }

  async userRegister(username: string): Promise<SuccessResponse> {
    const user = await this.dao.findUserByUsername(username);
    if (user) {
      throw GrpcErrors.alreadyExists('User');
    }
    await this.dao.createUser(username);
    return { message: 'User created' };
  }
}
