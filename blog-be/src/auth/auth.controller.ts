import { Body, Controller, Get, Patch, Post, Req, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from 'src/auth/dto/login.dto';
import { UserRefreshTokenDto } from 'src/auth/dto/user-refresh-token.dto';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { UserEntity } from 'src/database/entities/user.entity';
import { UserAuth } from 'src/decorators/http.decorator';
import { ApiOkResponse } from '@nestjs/swagger';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { UserChangePasswordDto } from 'src/auth/dto/user-change-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    return await this.authService.login(loginDto, req);
  }

  @Post('refresh-token')
  renewToken(@Body() body: UserRefreshTokenDto) {
    return this.authService.refreshToken(body);
  }

  @Get('me')
  @UserAuth()
  @ApiOkResponse({
    description: 'Get profile by token',
  })
  async profile(@AuthUser() user: UserEntity) {
    if (!user.status) {
      throw new UnauthorizedException();
    }
    delete user.password;

    return user;
  }
  
  @Patch('change-password')
  @UserAuth()
  @ApiOkResponse({
    type: UserChangePasswordDto,
    description: 'Change password by token',
  })
  async changePassword(
    @AuthUser() user: UserEntity,
    @Body() changePasswordDto: UserChangePasswordDto,
  ) {
    return this.authService.changePassword(user, changePasswordDto);
  }

  // @Post('register')
  // async register(@Body() registerDto: RegisterDto) {
  //   return await this.authService.register(registerDto);
  // }
}
