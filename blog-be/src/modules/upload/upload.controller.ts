import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ResourceType } from 'src/constant/resource-type';
import { UPLOAD_PATH_IMAGES } from 'src/constant/utils';
import { UserEntity } from 'src/database/entities/user.entity';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { UserAuth } from 'src/decorators/http.decorator';
import { imageUploadFilter } from 'src/filters/image-upload.filter';
import { fileMapper } from 'src/helpers/file-mapper.helper';
import { generateSnowflakeId } from 'src/helpers/generator.helper';
import { CreateUploadDto } from 'src/modules/upload/dto/create-upload.dto';
import { UploadService } from './upload.service';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post('/image')
  @UserAuth()
  @HttpCode(200)
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
    type: CreateUploadDto,
    description: 'Upload a image',
  })
  async uploadImage(
    @AuthUser() user: UserEntity,
    @Req() req: Request,
    @Body() body: CreateUploadDto,
    @UploadedFiles()
    files: {
      file?: Express.Multer.File[];
    },
  ) {
    return this.uploadService.upload(
      {
        ...body,
        file: files.file
          ? fileMapper({
              file: files.file[0],
              type: ResourceType.IMAGE,
            })
          : undefined,
        type: ResourceType.IMAGE,
      },
      files.file?.[0]?.fieldname,
      user.id,
    );
  }
}
