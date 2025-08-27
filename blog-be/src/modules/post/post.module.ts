import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/database/entities/category.entity';
import { PostEntity } from 'src/database/entities/post.entity';
import { PostJoinTagEntity } from 'src/database/entities/postJoinTag.entity';
import { TagEntity } from 'src/database/entities/tag.entity';
import { UploadModule } from '../upload/upload.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostEntity,
      CategoryEntity,
      TagEntity,
      PostJoinTagEntity,
    ]),
    UploadModule,
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
