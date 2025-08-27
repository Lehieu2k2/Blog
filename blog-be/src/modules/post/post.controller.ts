import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { UPLOAD_PATH_IMAGES } from 'src/constant/utils';
import { PostEntity } from 'src/database/entities/post.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { UserAuth } from 'src/decorators/http.decorator';
import { imageUploadFilter } from 'src/filters/image-upload.filter';
import { generateSnowflakeId } from 'src/helpers/generator.helper';
import { PostCreateDto } from 'src/modules/post/dto/post-create.dto';
import { PostListDto } from 'src/modules/post/dto/post-list.dto';
import { PostUpdateDto } from 'src/modules/post/dto/post-update.dto';
import { PostService } from 'src/modules/post/post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @UserAuth()
  @ApiOkResponse({
    type: PageDto,
    description: 'List Post',
  })
  async index(
    @AuthUser() user: UserEntity,
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() queries: PostListDto,
  ): Promise<PageDto<PostEntity>> {
    const [listItems, totalItems] = await this.postService.findAll(
      user,
      queries,
      pageOptionsDto,
    );

    return new PageDto<PostEntity>(
      listItems,
      new PageMetaDto({
        pageOptionsDto,
        totalItems,
      }),
    );
  }

  @Post('')
  @UserAuth()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'file', maxCount: 1 }], {
      storage: diskStorage({
        destination: join(`${UPLOAD_PATH_IMAGES}`),
        filename: (req, file, cb) => {
          cb(null, `${generateSnowflakeId()}${extname(file.originalname)}`);
        },
      }),
      fileFilter: imageUploadFilter,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    type: PostCreateDto,
    description: 'Create post',
  })
  async create(
    @Body() body: PostCreateDto,
    @AuthUser() user: UserEntity,
    @UploadedFiles() files: { file?: Express.Multer.File[] },
  ) {
    return await this.postService.create(
      {
        ...body,
        file: files?.file,
      },
      user,
    );
  }

  @Patch(':id')
  @UserAuth()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'file', maxCount: 1 }], {
      storage: diskStorage({
        destination: join(`${UPLOAD_PATH_IMAGES}`),
        filename: (req, file, cb) => {
          cb(null, `${generateSnowflakeId()}${extname(file.originalname)}`);
        },
      }),
      fileFilter: imageUploadFilter,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    type: PostUpdateDto,
    description: 'Update a post',
  })
  async update(
    @Param('id') id: string,
    @Body() body: PostUpdateDto,
    @AuthUser() user: UserEntity,
    @UploadedFiles() files: { file?: Express.Multer.File[] },
  ) {
    return await this.postService.update(
      id,
      {
        ...body,
        file: files.file,
      },
      user,
    );
  }

  @Get(':id')
  @UserAuth()
  @ApiOkResponse({
    description: 'Get a Post by id',
  })
  async show(@Param('id') id: string) {
    return await this.postService.findOne(id);
  }

  @Delete(':id')
  @UserAuth()
  @ApiOkResponse({
    description: 'Delete a post',
  })
  async delete(@Param('id') id: string, @AuthUser() user: UserEntity) {
    return await this.postService.delete(id, user);
  }
}
