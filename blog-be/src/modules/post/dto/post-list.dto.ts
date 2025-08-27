import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsUndefinable, ToLowerCase, Trim } from '../../../decorators';
import { IsIn, IsNumberString, IsString } from 'class-validator';

export class PostListDto {
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
  @IsNumberString({}, { message: 'Page is not valid' })
  page: number;

  @ApiPropertyOptional()
  @IsUndefinable()
  @IsNumberString({}, { message: 'Limit is not valid' })
  limit: number;

  @ApiPropertyOptional()
  @IsUndefinable()
  @IsNumberString({}, { message: 'Status is not valid' })
  status: number;
}
