import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../auth/decorators/user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('new')
  create(@Body() createPostDto: CreatePostDto, @User() user: any) {
    return this.postsService.create(createPostDto, user.id);
  }

  @Get()
  findAll() {
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
