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
    return await this.prisma.category.findMany();
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
    return await this.prisma.post.findMany({
      where: {
        category: { slug },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
