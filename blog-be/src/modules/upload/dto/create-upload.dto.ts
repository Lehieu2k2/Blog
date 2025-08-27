import { ApiProperty } from '@nestjs/swagger';
export class CreateUploadDto {
  @ApiProperty({ type: 'file' })
  file: string;
}
