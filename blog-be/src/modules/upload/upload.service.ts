import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { join } from 'path';
import * as sharp from 'sharp';
import { UPLOAD_PATH_IMAGES } from 'src/constant/utils';
import { LocalFile } from 'src/database/entities/localFile.entity';
import { Repository } from 'typeorm';
import {
  generateSlug,
  generateUrlResource,
} from '../../helpers/generator.helper';
import { GeneratorService } from '../../shared/services/generator.service';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(LocalFile)
    private localFileRepository: Repository<LocalFile>,
    private generatorService: GeneratorService,
  ) {}
  async upload(params: any, slug: string, userId: string) {
    let image = null;
    let path = null;
    const id = this.generatorService.generateSnowflakeId();

    if (params.file && typeof params.file?.originalname != undefined) {
      const isImage = params.file?.originalname.match(
        /\.(jpg|jpeg|png|gif|JPEG|JPG|PNG|GIF)$/,
      );
      if (isImage) {
        const fileName = `${slug || generateSlug(params.file?.originalname)}${'-' + new Date().getTime()}.webp`;
        const webpPath = join(UPLOAD_PATH_IMAGES, fileName);
        await sharp(params.file.path).webp({ quality: 100 }).toFile(webpPath);
        params.file.filename = fileName;
      }
      image = generateUrlResource(params.file);
      const entity = await this.localFileRepository.create({
        id: id,
        userId: userId,
        filename: params.file?.filename,
        path: params.file?.path,
        pathConvert: image,
        mimetype: params.file?.mimetype,
        type: params.type,
      });
      const create = await this.localFileRepository.save(entity);
      path = params.file?.path;

      if (!create) {
        image = null;
      }
    } else {
      throw new BadRequestException('File not found');
    }

    return { id: id, image: image, path: path };
  }
  async uploadFile(params: any, userId: string) {
    let image = null;
    let path = null;
    const id = this.generatorService.generateSnowflakeId();

    if (params.file && typeof params.file?.originalname != undefined) {
      image = generateUrlResource(params.file);
      const entity = await this.localFileRepository.create({
        id: id,
        userId: userId,
        filename: params.file?.filename,
        path: params.file?.path,
        pathConvert: image,
        mimetype: params.file?.mimetype,
        type: params.type,
      });
      const create = await this.localFileRepository.save(entity);
      path = params.file?.path;

      if (!create) {
        image = null;
      }
    } else {
      throw new BadRequestException('File not found');
    }

    return { id: id, image: image, path: path };
  }

  async deleteLocalFile(localFileId: string) {
    const entity = await this.localFileRepository.findOne({
      where: { id: localFileId },
    });
    if (entity) {
      await this.localFileRepository.remove(entity);
    }
  }
}
