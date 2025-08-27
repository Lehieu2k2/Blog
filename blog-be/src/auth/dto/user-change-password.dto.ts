import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Trim } from 'src/decorators';

export class UserChangePasswordDto {
  @ApiProperty()
  @Trim()
  @IsString()
  @Matches(
      /(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/,
      {
        message: "Old password is invalid",
      },
  )
  @MaxLength(50, { message: "Old password is not over 50 characters" })
  @MinLength(8, { message: "Old password is not less than 8 characters" })
  @IsNotEmpty({ message: "Old password is not empty" })
  oldPassword: string;

  @ApiProperty()
  @Trim()
  @IsString()
  @Matches(
      /(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/,
      {
        message: "New password is invalid",
      },
  )
  @MaxLength(50, { message: "New password is not over 50 characters" })
  @MinLength(8, { message: "New password is not less than 8 characters" })
  @IsNotEmpty({ message: "New password is not empty" })
  newPassword: string;
}
