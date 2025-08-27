// import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserRefreshTokenDto {
//   @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: 'Refresh token must not be empty',
  })
  readonly refreshToken: string;
}