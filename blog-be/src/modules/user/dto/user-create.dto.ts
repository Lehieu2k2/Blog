import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserGender } from 'src/constant/db/user-gender';
import { UserRole } from 'src/constant/db/user-role';

export class UserCreateDto {
  @ApiProperty()
  @IsNotEmpty({ message: "Account mustn't be empty" })
  @IsString()
  @MaxLength(50)
  @MinLength(5)
  account: string;

  @ApiProperty()
  @IsString()
  @MaxLength(50, { message: 'Fullname must not be longer than 50 characters.' })
  @MinLength(8, { message: 'Fullname must be at least 8 characters long.' })
  @IsNotEmpty({ message: "Fullname mustn't be empty" })
  fullName: string;

  @ApiProperty()
  @Matches(/^0\d{9,10}$/, { message: 'Phone number is invalid' })
  @IsNotEmpty({ message: "Phone number mustn't be empty" })
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty({ message: "Email mustn't be empty" })
  @IsEmail()
  email: string;

  @ApiProperty()
  @Matches(/^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/, {
    message: 'DOB is not valid',
  })
  @IsNotEmpty({
    message: "DOB mustn't be empty",
  })
  dateOfBirth: Date;

  @ApiProperty()
  @IsIn(
    [
      UserGender.GENDER_0,
      UserGender.GENDER_1,
      UserGender.GENDER_2,
      UserGender.GENDER_3,
    ],
    {
      message: 'Gender is invalid',
    },
  )
  gender: number;

  // @ApiProperty()
  // @IsNotEmpty({ message: "Password mustn't be empty" })
  // @IsString()
  // @Matches(
  //   /(?=(.*[0-9]))(?=.*[!@#$%^&*()\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=.*[A-Z]).{8,}/,
  //   {
  //     message: 'Password does not meet the requirements',
  //   },
  // )
  // @MaxLength(50, { message: 'Password must not be longer than 50 characters.' })
  // @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  // password: string;

  @ApiProperty({
    enum: UserRole,
    description: 'User role',
  })
  @IsIn(Object.values(UserRole), {
    message: 'Role is invalid',
  })
  role: UserRole;
}
