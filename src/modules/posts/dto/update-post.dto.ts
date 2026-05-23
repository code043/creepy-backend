import { IsString, MinLength, IsOptional, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsString()
  @MinLength(3)
  title!: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @MinLength(10)
  description!: string;

  @IsNotEmpty()
  content!: any;

  @IsString()
  slug!: string;

  @IsString()
  @IsOptional()
  categoryId?: string;
}
