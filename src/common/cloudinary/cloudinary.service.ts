import { Injectable, Inject } from '@nestjs/common';
import { v2 as Cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private cloudinary: typeof Cloudinary) {}

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'posts',
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream(
        {
          folder,
        },
        (error, result) => {
          if (result) resolve(result.secure_url);
          else reject(error);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  }
}
