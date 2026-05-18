import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        image: true,
        role: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: string) {
    const foundUser = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        role: true,
        posts: true,
      },
    });

    if (!foundUser) {
      throw new NotFoundException('User not found!');
    }

    return foundUser;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
