import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePostDto } from './dto/update-post.dto';

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
  async update(id: string, updateNoteDto: UpdatePostDto, userId: string) {
    const result = await this.prisma.post.updateMany({
      where: {
        id,
        userId,
      },
      data: updateNoteDto,
    });

    if (result.count === 0) {
      throw new NotFoundException('Note not found!');
    }

    return {
      message: 'Note updated successfully!',
      updatedId: id,
    };
  }

  async remove(id: string) {
    const post = await this.prisma.post.findFirst({
      where: { id },
    });
    if (!post) {
      throw new NotFoundException('Note not found!');
    }
    await this.prisma.post.delete({
      where: { id },
    });
  }
}
