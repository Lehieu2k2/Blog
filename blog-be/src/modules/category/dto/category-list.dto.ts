import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsUndefinable, ToLowerCase, Trim } from '../../../decorators';
import { IsIn, IsNumberString, IsString } from 'class-validator';

export class CategoryListDto {
  @ApiPropertyOptional()
  @IsUndefinable()
  @IsString()
  @Trim()
  keyword: string;

  @ApiPropertyOptional()
  @IsUndefinable()
  @IsString()
  orderField?: string;

  @ApiPropertyOptional()
  @IsUndefinable()
  @IsString()
  @IsIn(['asc', 'desc'])
  @ToLowerCase()
  orderType?: string;

  @ApiPropertyOptional()
  @IsUndefinable()
  @IsNumberString({}, { message: 'Page is invalid' })
  page: number;

  @ApiPropertyOptional()
  @IsUndefinable()
  @IsNumberString({}, { message: 'Limit is invalid' })
  limit: number;

  @ApiPropertyOptional()
  @IsUndefinable()
  @IsNumberString({}, { message: 'Status is invalid' })
  status: number;
}
