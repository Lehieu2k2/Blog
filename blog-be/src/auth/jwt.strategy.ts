import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRole } from 'src/constant/db/user-role';
import { UserStatus } from 'src/constant/db/user-status';
import { UserService } from 'src/modules/user/user.service';
import { TABLE_USERS, UserEntity } from '../database/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UserService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_KEY'),
    });
  }

  async validate(args: {
    userId: string;
    table: string;
    role: string;
    account?: string;
  }): Promise<UserEntity> {
    let user;
    if (args.table === TABLE_USERS) {
      user = await this.usersService.findOneById(args.userId);

      if (!user) {
        throw new UnauthorizedException();
      }
    }

    if (!user) {
      throw new UnauthorizedException();
    }

    // Check if user is banned
    if (user.status === UserStatus.BANNED) {
      throw new UnauthorizedException('User is banned');
    }

    delete user.password;
    // Set role from token payload - cast to UserRole enum
    user.role = args.role as UserRole;
    return user;
  }
}
