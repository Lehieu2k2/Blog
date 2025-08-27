import { Request } from 'express';
import { BadRequestException } from '@nestjs/common';

export const imageUploadFilter = (
  req: Request,
  file: Express.Multer.File,
  callback,
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|JPEG|JPG|PNG|GIF)$/)) {
    return callback(
      new BadRequestException(
        'Only image files are allowed'
      ),
      false,
    );
  }
  if (file.size > 2 * 1024 * 1024) {
    return callback(
      new BadRequestException(
        'Image size of file should not be greater than 2MB'
      ),
      false,
    );
  }
  callback(null, true);
};
