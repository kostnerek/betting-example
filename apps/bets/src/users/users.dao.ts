import { Injectable } from '@nestjs/common';
import { PrismaService } from 'apps/bets/src/prisma/prisma.service';

@Injectable()
export class UsersDao {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserById(id: string) {
    return this.prismaService.user.findFirst({
      where: { id },
      include: { bets: true },
    });
  }

  async findUserByUsername(username: string) {
    return this.prismaService.user.findFirst({
      where: { username },
      include: { bets: true },
    });
  }

  async createUser(username: string) {
    return this.prismaService.user.create({ data: { username } });
  }

  async updateUserBalance(userId: string, balance: number) {
    return this.prismaService.user.update({
      where: { id: userId },
      data: { balance },
    });
  }
}
