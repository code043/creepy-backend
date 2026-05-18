import { IsString, MinLength, IsOptional } from 'class-validator';

export class CreatePostDto {
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
