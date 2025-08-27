import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { PostStatus } from 'src/constant/db/post-status';
import { IsUndefinable, Trim } from '../../../decorators';

export class PostCreateDto {
  @ApiPropertyOptional({ type: 'file' })
  @IsUndefinable()
  file: Express.Multer.File[];

  @ApiProperty()
  @Trim()
  @IsString()
  @IsNotEmpty({
    message: 'Title is required',
  })
  title: string;

  @ApiPropertyOptional()
  @Trim()
  @IsUndefinable()
  @IsUndefinable()
  @IsString()
  slug: string;

  @ApiProperty()
  @Trim()
  @IsNotEmpty({
    message: 'Category is required',
  })
  @IsNumberString(
    {},
    {
      message: 'Category is required',
    },
  )
  categoryId: string;

  @ApiProperty()
  @Trim()
  @IsNotEmpty({
    message: 'Content is required',
  })
  content: string;

  @ApiPropertyOptional()
  @Trim()
  @IsUndefinable()
  @IsIn(
    [
      PostStatus.DRAFT.toString(),
      PostStatus.PUBLISHED.toString(),
      PostStatus.REJECTED.toString(),
      PostStatus.PENDING.toString(),
    ],
    {
      message: 'Status is invalid',
    },
  )
  status: number;

  @ApiPropertyOptional()
  @Trim()
  @IsUndefinable()
  @IsNotEmpty({
    message: 'Description is required',
  })
  description: string;

  @ApiPropertyOptional()
  @Trim()
  @IsUndefinable()
  @IsString()
  tag: string;
}
