import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        description: createCategoryDto.description,
        slug: createCategoryDto.slug,
        image: createCategoryDto.image,
        color: createCategoryDto.color,
        icon: createCategoryDto.icon,
        metaTitle: createCategoryDto.metaTitle,
        metaDescription: createCategoryDto.metaDescription,
        isFeatured: createCategoryDto.isFeatured,
        order: createCategoryDto.order,
      },
    });
  }

  async findAll() {
    return await this.prisma.category.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });
  }

  async findOneBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
    });
    if (!category) {
      throw new NotFoundException('Category not found!');
    }
    return category;
  }
  async findOneById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Category not found!');
    }
    return category;
  }
  async getPostsByCategory(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      throw new NotFoundException('Category not found!');
    }
    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: {
          category: { slug },
        },
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          image: true,
          createdAt: true,
          views: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.post.count({
        where: {
          category: { slug },
        },
      }),
    ]);

    return {
      data: posts,
      total,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
