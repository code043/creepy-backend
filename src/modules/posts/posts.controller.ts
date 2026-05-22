import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../auth/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from '../auth/decorators/auth.user.decorator';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { LatestPostsDto } from './dto/latest-post.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private cloudinary: CloudinaryService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('new')
  create(@Auth('id') userId: string, @Body() dto: CreatePostDto) {
    return this.postsService.create(userId, dto);
  }
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const url = await this.cloudinary.uploadFile(file);
    return { url };
  }
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAllUserPosts(@Auth('id') userId: string) {
    return this.postsService.findAllUserPosts(userId);
  }
  @Get('all')
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '',
  ) {
    return this.postsService.paginationSearch(
      Number(page),
      Number(limit),
      search,
    );
  }
  @Get('latest')
  async getLatest(@Query() query: LatestPostsDto) {
    return this.postsService.getLatestPosts(query.limit ?? 12);
  }
  @Get('id/:id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.postsService.findBySlug(slug);
  }
  @Post(':slug/view')
  incrementView(@Param('slug') slug: string) {
    return this.postsService.incrementViews(slug);
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdatePostDto,
    @User() user: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.postsService.update(id, updateNoteDto, user.id, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
