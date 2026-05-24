import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Query,
  // UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
//import { AuthGuard } from '@nestjs/passport';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private cloudinary: CloudinaryService,
  ) {}

  //@UseGuards(AuthGuard('jwt'))
  @Post('new')
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const url = await this.cloudinary.uploadFile(file, 'categories');
    return { url };
  }
  @Get()
  getAll() {
    return this.categoriesService.findAll();
  }

  @Get(':slug/posts')
  getAllCategoryPosts(
    @Param('slug') slug: string,
    @Query('page') page = 1,
    @Query('limit') limit = 6,
    @Query('search') search = '',
  ) {
    return this.categoriesService.paginationSearchByCategory(
      slug,
      page,
      limit,
      search,
    );
  }

  @Get('id/:id')
  findOneById(@Param('id') id: string) {
    return this.categoriesService.findOneById(id);
  }
  @Get('slug/:slug')
  findOneBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findOneBySlug(slug);
  }
  @Get(':slug/posts')
  getPostsByCategory(@Param('slug') slug: string) {
    return this.categoriesService.getPostsByCategory(slug);
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
