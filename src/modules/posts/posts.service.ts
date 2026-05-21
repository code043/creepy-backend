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
  async create(
    userId: string,
    createPostDto: CreatePostDto,
    file?: Express.Multer.File,
  ) {
    let imageUrl: string | null = null;

    if (file) {
      imageUrl = await this.cloudinary.uploadFile(file);
    }
    return await this.prisma.post.create({
      data: {
        title: createPostDto.title,
        content: createPostDto.content,
        description: createPostDto.description,
        slug: createPostDto.slug,
        image: imageUrl,
        userId: userId,
      },
    });
  }

  async findAllUserPosts(userId: string) {
    return await this.prisma.post.findMany({
      where: { userId },
    });
  }

  async pagination(page: number, limit: number, search: string) {
    const skip = (page - 1) * limit;

    const where: Prisma.PostWhereInput = search
      ? {
          OR: [
            {
              title: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {};

    const posts = await this.prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.post.count({ where });

    return {
      data: posts,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
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
