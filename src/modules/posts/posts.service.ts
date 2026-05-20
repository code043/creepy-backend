import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';

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
  async update(
    id: string,
    updateNoteDto: UpdatePostDto,
    userId: string,
    file?: Express.Multer.File,
  ) {
    const post = await this.prisma.post.findFirst({ where: { id, userId } });

    if (!post) {
      throw new NotFoundException('Note not found!');
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
