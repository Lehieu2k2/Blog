import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsNumberString,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsUndefinable, Trim } from '../../../decorators';
import { CategoryStatus } from 'src/constant/db/category-status';

export class CategoryCreateDto {
  @ApiProperty()
  @Trim()
  @IsString()
  @MaxLength(100, {
    message: 'Title must be less than 100 characters',
  })
  @IsNotEmpty({
    message: 'Title is required',
  })
  title: string;

  @ApiPropertyOptional()
  @Trim()
  @IsString()
  slug: string;

  @ApiPropertyOptional()
  @Trim()
  @IsUndefinable()
  @IsIn([CategoryStatus.ACTIVE.toString(), CategoryStatus.INACTIVE.toString()], {
    message: 'Status is invalid',
  })
  status: number;

  @ApiPropertyOptional()
  @Trim()
  @IsUndefinable()
  @IsNumberString(
    {},
    {
      message: 'Parent ID is invalid',
    },
  )
  parentId: string;

  @ApiPropertyOptional()
  @IsUndefinable()
  @Trim()
  content: string;

  @ApiPropertyOptional()
  @Trim()
  @IsUndefinable()
  description: string;  
}
