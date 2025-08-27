import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { LocalFile } from 'src/database/entities/localFile.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LocalFile, UserEntity]),
    MulterModule.register({
      dest: './public/uploads',
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
