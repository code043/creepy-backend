import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

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

  async paginationSearchByCategory(
    slug: string,
    page = 1,
    limit = 5,
    search = '',
  ) {
    const safeLimit = Math.max(1, Number(limit) || 5);

    const category = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      throw new NotFoundException('Category not found!');
    }

    const where: Prisma.PostWhereInput = {
      category: { slug },
      ...(search && {
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
      }),
    };

    const total = await this.prisma.post.count({ where });

    const lastPage = Math.max(1, Math.ceil(total / safeLimit));

    const safePage = Math.min(Math.max(1, Number(page) || 1), lastPage);

    const skip = (safePage - 1) * safeLimit;

    const posts = await this.prisma.post.findMany({
      where,
      skip,
      take: safeLimit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        image: true,
        createdAt: true,
        views: true,
      },
    });

    return {
      data: posts,
      total,
      page: safePage,
      lastPage,
      limit: safeLimit,
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
