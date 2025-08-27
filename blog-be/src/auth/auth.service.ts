import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserChangePasswordDto } from 'src/auth/dto/user-change-password.dto';
import { UserRefreshTokenService } from 'src/auth/user-refresh-token.service';
import { TABLE_USERS, UserEntity } from 'src/database/entities/user.entity';
import { GeneratorService } from 'src/shared/services/generator.service';
import { Repository } from 'typeorm';
import { UserRefreshToken } from '../database/entities/userRefreshToken.entity';
import { UserService } from '../modules/user/user.service';
import { LoginDto } from './dto/login.dto';
import { UserRefreshTokenDto } from './dto/user-refresh-token.dto';

type LoginRes = {
  access_token: string;
  refresh_token: string;
};

type RefreshTokenResponse = {
  access_token: string;
  refresh_token: string;
};

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly userRefreshTokenService: UserRefreshTokenService,
    private readonly jwtService: JwtService,
    private readonly generatorService: GeneratorService,
    private readonly configService: ConfigService,
    @InjectRepository(UserRefreshToken)
    private userRefreshTokenRepository: Repository<UserRefreshToken>,
  ) {}

  async login(loginDto: Partial<LoginDto>, req: Request): Promise<LoginRes> {
    const { account, password } = loginDto;

    // Validate user
    const user = await this.userService.findByAccount(account);
    if (!user) {
      throw new HttpException(
        'Account does not exist',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Check password
    if (!(await bcrypt.compare(password, user.password))) {
      throw new HttpException('Password is incorrect', HttpStatus.UNAUTHORIZED);
    }

    // Validate user status
    // if (!user.status) {
    //   throw new HttpException('Account is locked', HttpStatus.FORBIDDEN);
    // }
    // if (!user.isVerified) {
    //   throw new HttpException('Account is not verified', HttpStatus.FORBIDDEN);
    // }

    // Clean up expired tokens for this user
    await this.userRefreshTokenService.checkAndLogoutExpiredTokens(user.id);

    // Generate tokens
    const payload = {
      account,
      userId: user.id,
      table: TABLE_USERS,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.generatorService.generateRandomToken(32);
    await this.userRefreshTokenService.create({
      refresh_token: refreshToken,
      user_id: user.id,
    });
    await this.userRefreshTokenService.checkAndLogoutExpiredTokens(user.id);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async refreshToken(
    attrs: UserRefreshTokenDto,
  ): Promise<RefreshTokenResponse> {
    const verifyRefreshToken = await this.userRefreshTokenService.findByToken(
      attrs.refreshToken,
    );

    if (!verifyRefreshToken) {
      throw new BadRequestException('Refresh token is expired');
    }

    if (typeof verifyRefreshToken?.user === 'undefined') {
      throw new BadRequestException(
        'User not found for the provided refresh token',
      );
    }
    const user = verifyRefreshToken.user;

    if (!user.status) {
      throw new BadRequestException('Account is locked');
    }

    if (!user.isVerified) {
      throw new BadRequestException('Account is not verified');
    }

    const accessTokenPayload = {
      account: user.account,
      userId: user.id,
      table: TABLE_USERS,
      role: user.role,
    };
    const newAccessToken = this.jwtService.sign(accessTokenPayload);
    const newRefreshToken = this.generatorService.generateRandomToken(32);

    // Mark current refresh token as expired
    verifyRefreshToken.expiredAt = new Date();
    await this.userRefreshTokenService.update(verifyRefreshToken);

    // Create new refresh token
    await this.userRefreshTokenService.create({
      refresh_token: newRefreshToken,
      user_id: user.id,
    });

    return { access_token: newAccessToken, refresh_token: newRefreshToken };
  }

  async logout(userId: string): Promise<void> {
    // Invalidate all refresh tokens for user
    await this.userRefreshTokenRepository.update(
      { userId },
      { expiredAt: new Date() },
    );
  }

  async changePassword(
    user: UserEntity,
    attrs: UserChangePasswordDto,
  ): Promise<UserEntity> {
    const entity = await this.userService.findOneById(user.id);
    if (!entity) {
      throw new NotFoundException('User not found');
    }

    if (!(await bcrypt.compare(attrs.oldPassword, entity.password))) {
      throw new BadRequestException('Old password is incorrect');
    }
    entity.password = bcrypt.hashSync(attrs.newPassword, 10);
    // entity.updatePasswordAt = new Date();
    await this.userService.updateById(entity.id, entity);

    delete entity.password;

    return entity;
  }

  // async register(registerDto: RegisterDto): Promise<{ message: string }> {
  //   const { account, password, email } = registerDto;
  //   // Kiểm tra account/email đã tồn tại chưa
  //   const existedUser = await this.userService.findByAccount(account);
  //   if (existedUser) {
  //     throw new ConflictException('Account or email already exists');
  //   }
  //   // Tạo user mới (UserService sẽ tự hash password)
  //   const user = await this.userService.create({
  //     account,
  //     password,
  //     email,
  //   });
  //   if (!user) {
  //     throw new BadRequestException('Cannot create user');
  //   }
  //   return { message: 'Register successfully' };
  // }
}
