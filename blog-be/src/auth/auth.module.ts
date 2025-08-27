import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { UserRefreshTokenService } from 'src/auth/user-refresh-token.service';
import { UserEntity } from 'src/database/entities/user.entity';
import { UserRefreshToken } from 'src/database/entities/userRefreshToken.entity';
import { UserModule } from 'src/modules/user/user.module';
import { SharedModule } from 'src/shared/shared.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_KEY'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_EXPIRATION_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserRefreshToken, UserEntity]),
    UserModule,
    SharedModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserRefreshTokenService],
  exports: [JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
