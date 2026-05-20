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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../auth/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from '../auth/decorators/auth.user.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('new')
  @UseInterceptors(FileInterceptor('file'))
  async createPost(
    @Auth('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreatePostDto,
  ) {
    return this.postsService.create(userId, dto, file);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAllUserPosts(@Auth('id') userId: string) {
    return this.postsService.findAllUserPosts(userId);
  }
  @Get('all')
  fintAll() {
    return this.postsService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdatePostDto,
    @User() user: any,
  ) {
    return this.postsService.update(id, updateNoteDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
