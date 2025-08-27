
import {IsString, IsNotEmpty, Matches, IsEmail, MaxLength, MinLength} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty({ message: "Account mustn't be empty" })
  readonly account: string;

  @ApiProperty()
  @IsNotEmpty({ message: "Email mustn't be empty" })
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @Matches(
      /(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/,
      {
        message: "Password does not meet the requirements",
      },
  )
  @MaxLength(50, { message: "Password must not be longer than 50 characters. " })
  @MinLength(8, { message: "Password must be at least 8 characters long." })
  @IsNotEmpty({ message: "Password mustn't be empty" })
  readonly password: string;
}
