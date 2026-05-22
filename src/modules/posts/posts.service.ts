import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}
  async create(userId: string, dto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        title: dto.title,
        description: dto.description,
        content: dto.content,
        slug: dto.slug,
        image: dto.image,
        userId,
      },
    });
  }
  async findAllUserPosts(userId: string) {
    return await this.prisma.post.findMany({
      where: { userId },
    });
  }
  async pagination(page: number, limit: number) {
    const safePage = Number(page) || 1;
    const safeLimit = Number(limit) || 10;
    const skip = (safePage - 1) * safeLimit;

    const posts = await this.prisma.post.findMany({
      skip,
      take: safeLimit,
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.post.count();

    return {
      data: posts,
      total,
      page: safePage,
      lastPage: Math.ceil(total / safeLimit),
    };
  }

  async paginationSearch(page = 1, limit = 5, search = '') {
    const safePage = Number(page) || 1;
    const safeLimit = Number(limit) || 5;

    const skip = (safePage - 1) * safeLimit;

    const where: Prisma.PostWhereInput = search
      ? {
          OR: [
            {
              title: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              description: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        }
      : {};

    const posts = await this.prisma.post.findMany({
      where,
      skip,
      take: safeLimit,
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.post.count({ where });

    return {
      data: posts,
      total,
      page: safePage,
      lastPage: Math.ceil(total / safeLimit),
    };
  }
  async getLatestPosts(limit: number) {
    return this.prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }
  async findOne(id: string) {
    const post = await this.prisma.post.findFirst({
      where: { id },
    });
    if (!post) {
      throw new NotFoundException('Post not found!');
    }
    return post;
  }
  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
    });
    if (!post) {
      throw new NotFoundException('Post not found!');
    }
    return post;
  }
  async incrementViews(slug: string) {
    return this.prisma.post.update({
      where: { slug },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  }
  async update(
    id: string,
    updateNoteDto: UpdatePostDto,
    userId: string,
    file?: Express.Multer.File,
  ) {
    const post = await this.prisma.post.findFirst({ where: { id, userId } });

    if (!post) {
      throw new NotFoundException('Post not found!');
    }

    let imageUrl = post.image;

    if (file) {
      imageUrl = await this.cloudinary.uploadFile(file);
    }

    await this.prisma.post.update({
      where: { id },
      data: {
        ...updateNoteDto,
        image: imageUrl,
      },
    });

    return {
      message: 'Post updated successfully!',
      updatedId: id,
    };
  }

  async remove(id: string) {
    const post = await this.prisma.post.findFirst({
      where: { id },
    });
    if (!post) {
      throw new NotFoundException('Post not found!');
    }
    await this.prisma.post.delete({
      where: { id },
    });
  }
}
