import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashSync } from 'bcrypt';
import { isEmail } from 'class-validator';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { UserRole } from 'src/constant/db/user-role';
import { UserStatus } from 'src/constant/db/user-status';
import { TABLE_USERS, UserEntity } from 'src/database/entities/user.entity';
import { isPhone, parseDate } from 'src/helpers/common.helper';
import { UserCreateDto } from 'src/modules/user/dto/user-create.dto';
import { UserListDto } from 'src/modules/user/dto/user-list.dto';
import { UserUpdateDto } from 'src/modules/user/dto/user-update.dto';
import { GeneratorService } from 'src/shared/services/generator.service';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly generatorService: GeneratorService,
    private readonly mailerService: MailerService,
  ) {}

  async findAll(
    user: UserEntity,
    queries: UserListDto,
    pageOptionsDto: PageOptionsDto,
  ): Promise<[UserEntity[], number]> {
    const queryBuilder = this.userRepository.createQueryBuilder(TABLE_USERS);

    const condition = await this.generateConditionFinds(user, queries);
    if (condition) {
      queryBuilder.where(condition, { user, queries });
    }

    const [data, total] = await queryBuilder
      .select([`${TABLE_USERS}`])
      .orderBy(
        queries.orderField
          ? `${TABLE_USERS}.${queries.orderField}`
          : `${TABLE_USERS}.createdAt`,
        queries.orderType === 'asc' ? 'ASC' : 'DESC',
      )
      .take(queries.limit ? queries.limit : pageOptionsDto.limit)
      .skip(pageOptionsDto.offset)
      .getManyAndCount();

    return [data, total];
  }

  async generateConditionFinds(user: UserEntity, queries: UserListDto) {
    let condition = '';

    if (typeof queries.status !== 'undefined') {
      if (condition) condition += ` AND `;
      condition += `${TABLE_USERS}.status = ${queries.status}`;
    }

    if (queries.keyword) {
      if (condition) {
        condition += ' AND (';
      } else {
        condition += '(';
      }
      const keyword = `'%${queries.keyword}%'`;
      condition += ` LOWER(${TABLE_USERS}.fullName) LIKE LOWER(${keyword})`;
      condition += ` OR ${TABLE_USERS}.phoneNumber LIKE ${keyword}`;
      condition += ` OR ${TABLE_USERS}.email LIKE ${keyword}`;
      condition += ` OR ${TABLE_USERS}.account LIKE ${keyword}`;
      condition += ')';
    }

    return condition;
  }

  async create(attrs: Partial<UserCreateDto>): Promise<UserEntity> {
    // Check Phone (if provided)
    if (attrs.phoneNumber) {
      const isPhone = await this.userRepository.findOneBy({
        phoneNumber: attrs.phoneNumber,
      });
      if (isPhone) {
        throw new BadRequestException('Phone number already exists');
      }
    }

    // Check Email
    const isEmail = await this.userRepository.findOneBy({
      email: attrs.email,
    });
    if (isEmail) {
      throw new BadRequestException('Email already exists');
    }

    // Check Account
    const isAccount = await this.userRepository.findOneBy({
      account: attrs.account,
    });
    if (isAccount) {
      throw new BadRequestException('Account already exists');
    }

    // Handle dateOfBirth conversion (optional)
    const processedDateOfBirth = parseDate(attrs.dateOfBirth);

    // Create entity (exclude dateOfBirth from attrs to prevent override)
    const { dateOfBirth: _, ...attrsWithoutDateOfBirth } = attrs;

    const entity = this.userRepository.create({
      id: this.generatorService.generateSnowflakeId(),
      dateOfBirth: processedDateOfBirth,
      status: UserStatus.ACTIVE,
      isVerified: true,
      role: attrs.role || UserRole.TYPE_AUTHOR,
      ...attrsWithoutDateOfBirth, // Use attrs without dateOfBirth to prevent override
    });

    // Always generate random password for admin-created users
    const plainPassword = this.generatorService.generateRandomPassword();
    entity.password = hashSync(plainPassword, 10);

    const savedEntity = await this.userRepository.save(entity);

    // Always send password via email for admin-created users
    await this.sendPasswordEmail(savedEntity, plainPassword);

    // Remove password from response for security
    delete savedEntity.password;

    return savedEntity;
  }

  async update(
    id: string,
    attrs: Partial<UserUpdateDto>,
    user: UserEntity,
  ): Promise<UserEntity> {
    const entity = await this.userRepository.findOne({
      where: { id },
    });
    if (!entity) {
      throw new NotFoundException('User not found');
    }

    if (attrs.phoneNumber !== entity.phoneNumber) {
      if (attrs.phoneNumber && !isPhone(attrs.phoneNumber)) {
        throw new BadRequestException('Phone number is invalid');
      }

      if (attrs.phoneNumber) {
        const entityPhoneNumber = await this.userRepository.findOneBy({
          phoneNumber: attrs.phoneNumber,
        });
        if (entityPhoneNumber) {
          throw new BadRequestException('Phone number already exists');
        }
      }
    }

    if (attrs.email !== entity.email) {
      if (attrs.email && !isEmail(attrs.email)) {
        throw new BadRequestException('Email is invalid');
      }

      if (attrs.email) {
        const entityPhoneNumber = await this.userRepository.findOneBy({
          email: attrs.email,
        });
        if (entityPhoneNumber) {
          throw new BadRequestException('Email already exists');
        }
      }
    }

    // Handle dateOfBirth conversion (optional)
    const processedDateOfBirth = parseDate(attrs.dateOfBirth);

    // Exclude dateOfBirth from attrs to prevent override
    const { dateOfBirth: _, ...attrsWithoutDateOfBirth } = attrs;

    Object.assign(entity, attrsWithoutDateOfBirth);
    if (processedDateOfBirth !== null) {
      entity.dateOfBirth = processedDateOfBirth;
    }
    if (typeof attrs.password !== 'undefined' && attrs.password) {
      entity.password = hashSync(attrs.password, 10);
    }

    await this.userRepository.save(entity);

    delete entity.password;
    return entity;
  }

  async updateById(id: string, attrs: any) {
    await this.userRepository
      .createQueryBuilder()
      .update(UserEntity)
      .set(attrs)
      .where('id = :id', { id })
      .execute();
  }

  async findOne(id: string): Promise<UserEntity> {
    const entity = await this.userRepository.findOne({
      where: { id: id },
    });

    if (!entity) {
      throw new NotFoundException('User not found');
    }

    delete entity.password;
    return entity;
  }

  async findByAccount(account: string): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({ where: { account: account } });
  }

  async findOneById(id: string): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({
      where: { id: id },
    });
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  async findByPhoneNumber(
    phoneNumber: string,
  ): Promise<UserEntity | undefined> {
    return await this.userRepository.findOne({
      where: { phoneNumber: phoneNumber },
    });
  }

  async delete(id: string, user: UserEntity): Promise<void> {
    const entity = await this.findOneById(id);

    if (!entity) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.remove(entity);
  }

  async updateStatus(id: string, user: UserEntity): Promise<UserEntity> {
    const entity = await this.userRepository.findOne({
      where: { id: id },
    });

    if (!entity) {
      throw new NotFoundException('User not found');
    }

    // Toggle between ACTIVE and INACTIVE status
    if (
      entity.status === null ||
      entity.status === undefined ||
      entity.status === UserStatus.INACTIVE
    ) {
      entity.status = UserStatus.ACTIVE;
    } else if (entity.status === UserStatus.ACTIVE) {
      entity.status = UserStatus.INACTIVE;
    } else {
      entity.status = UserStatus.ACTIVE;
    }

    await this.userRepository.save(entity);

    delete entity.password;

    return entity;
  }

  async banUser(id: string, moderator: UserEntity): Promise<UserEntity> {
    const entity = await this.userRepository.findOne({
      where: { id: id },
    });

    if (!entity) {
      throw new NotFoundException('User not found');
    }

    if (entity.status === UserStatus.BANNED) {
      throw new BadRequestException('User is already banned');
    }

    // Ban user
    entity.status = UserStatus.BANNED;
    await this.userRepository.save(entity);

    delete entity.password;
    return entity;
  }

  async unbanUser(id: string, moderator: UserEntity): Promise<UserEntity> {
    const entity = await this.userRepository.findOne({
      where: { id: id },
    });

    if (!entity) {
      throw new NotFoundException('User not found');
    }

    if (entity.status !== UserStatus.BANNED) {
      throw new BadRequestException('User is not banned');
    }

    // Unban user - set to ACTIVE
    entity.status = UserStatus.ACTIVE;
    await this.userRepository.save(entity);

    delete entity.password;
    return entity;
  }

  private async sendPasswordEmail(
    user: UserEntity,
    password: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Your Account Has Been Created - Blog Platform',
        template: 'send-password',
        context: {
          fullName: user.fullName,
          email: user.email,
          account: user.account,
          password: password,
        },
      });
    } catch (error) {
      console.error('Failed to send password email:', error);
    }
  }
}
