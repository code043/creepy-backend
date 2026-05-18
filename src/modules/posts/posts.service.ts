import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll() {
    return await this.prisma.post.findMany();
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findFirst({
      where: { id },
    });
    if (!post) {
      throw new NotFoundException('Note not found!');
    }
    return post;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
