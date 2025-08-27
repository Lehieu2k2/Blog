import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRefreshToken } from 'src/database/entities/userRefreshToken.entity';
import { GeneratorService } from 'src/shared/services/generator.service';
import { LessThanOrEqual, MoreThan, Repository } from 'typeorm';

type CreateAttrs = {
  refresh_token: string;
  user_id: string;
  expiredAt?: Date;
};

@Injectable()
export class UserRefreshTokenService {
  constructor(
    @InjectRepository(UserRefreshToken)
    private readonly userRefreshTokenRepository: Repository<UserRefreshToken>,
    private readonly generatorService: GeneratorService,
  ) {}

  async create(attrs: CreateAttrs): Promise<UserRefreshToken> {
    const expiredAt =
      attrs.expiredAt ||
      (() => {
        const date = new Date();
        date.setDate(date.getDate() + 7); // default 7 days
        return date;
      })();

    const entity = this.userRefreshTokenRepository.create({
      id: this.generatorService.generateSnowflakeId(),
      userId: attrs.user_id,
      refreshToken: attrs.refresh_token,
      expiredAt,
    });

    return await this.userRefreshTokenRepository.save(entity);
  }

  async findByToken(token: string): Promise<UserRefreshToken | undefined> {
    return await this.userRefreshTokenRepository.findOne({
      where: {
        refreshToken: token,
        expiredAt: MoreThan(new Date()),
      },
      relations: {
        user: true,
      },
    });
  }

  async update(attrs: UserRefreshToken): Promise<UserRefreshToken> {
    return await this.userRefreshTokenRepository.save(attrs);
  }

  async removeExpiredTokens(userId: string): Promise<void> {
    const now = new Date();
    const expiredTokens = await this.userRefreshTokenRepository.find({
      where: {
        userId,
        expiredAt: LessThanOrEqual(now),
      },
    });

    if (expiredTokens.length > 0) {
      await this.userRefreshTokenRepository.remove(expiredTokens);
    }
  }

  async checkAndLogoutExpiredTokens(userId: string): Promise<void> {
    const now = new Date();
    const expiredTokens = await this.userRefreshTokenRepository.find({
      where: {
        userId,
        expiredAt: LessThanOrEqual(now),
      },
    });

    if (expiredTokens.length > 0) {
      await this.userRefreshTokenRepository.remove(expiredTokens);
    }
  }

  async findByUserId(userId: string): Promise<UserRefreshToken | null> {
    return await this.userRefreshTokenRepository.findOne({
      where: { userId },
    });
  }
}
