import { IsString, MinLength, IsOptional } from 'class-validator';

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
  @MinLength(30)
  description!: string;

  @IsString()
  @MinLength(10)
  content!: string;

  @IsString()
  slug!: string;
}
