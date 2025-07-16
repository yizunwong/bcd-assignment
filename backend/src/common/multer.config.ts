// src/common/multer.config.ts
import { MulterModule } from '@nestjs/platform-express';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads', // Directory to store uploaded files
      limits: {
        fileSize: 10000000, // 10MB limit
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|pdf)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Only image and PDF files are allowed!'), false);
        }
      },
    }),
  ],
})
export class MulterConfigModule {}
