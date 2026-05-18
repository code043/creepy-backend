import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}
  async create(createPostDto: CreatePostDto, userId: string) {
    return await this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        description: createPostDto.description,
        slug: createPostDto.slug,
        image: createPostDto.image ?? null,
        userId: userId,
      },
    });
  }

  findAll() {
    return `This action returns all posts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
