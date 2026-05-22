import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  name!: string;
  @IsString()
  username!: string;
  @IsString()
  image!: string;
  @IsEmail()
  email!: string;
  @IsString()
  @MinLength(5)
  password!: string;
}
