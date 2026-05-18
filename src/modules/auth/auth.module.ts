import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { StringValue } from 'ms';
import { JwtStrategy } from './guards/jwt.strategy';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || 'secret',
      signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRES as StringValue },
    }),
    CloudinaryModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
