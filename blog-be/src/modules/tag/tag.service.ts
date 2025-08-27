import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PostJoinTagEntity } from 'src/database/entities/postJoinTag.entity';
import { TABLE_TAGS, TagEntity } from 'src/database/entities/tag.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { TagListDto } from 'src/modules/tag/dto/tag-list.dto';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TagService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(TagEntity)
    private tagRepository: Repository<TagEntity>,
  ) {}

  async findAll(
    user: UserEntity,
    queries: TagListDto,
    pageOptionsDto: PageOptionsDto,
  ): Promise<[TagEntity[], number]> {
    const queryBuilder = this.tagRepository.createQueryBuilder(TABLE_TAGS);

    const condition = await this.generateConditionFinds(user, queries);
    if (condition) {
      queryBuilder.where(condition, { user, queries });
    }
    const [data, total] = await queryBuilder
      .orderBy(
        queries.orderField
          ? `${TABLE_TAGS}.${queries.orderField}`
          : `${TABLE_TAGS}.createdAt`,
        queries.orderType === 'asc' ? 'ASC' : 'DESC',
      )
      .take(queries.limit ? queries.limit : pageOptionsDto.limit)
      .skip(pageOptionsDto.offset)
      .getManyAndCount();
    return [data, total];
  }
  async generateConditionFinds(user: UserEntity, queries: TagListDto) {
    let condition = '';
    if (typeof queries.status !== 'undefined') {
      if (condition) condition += ` AND `;
      condition += `${TABLE_TAGS}.status = ${queries.status}`;
    }

    if (queries.keyword) {
      if (condition) {
        condition += ' AND (';
      } else {
        condition += '(';
      }
      const keyword = `'%${queries.keyword}%'`;
      condition += ` LOWER(${TABLE_TAGS}.title) LIKE LOWER(${keyword})`;
      condition += ` OR LOWER(${TABLE_TAGS}.slug) LIKE LOWER(${keyword})`;
      condition += ')';
    }
    return condition;
  }

  async findOne(id: string): Promise<TagEntity> {
    const entity = await this.tagRepository.findOne({
      where: { id: id },
      relations: ['postJoinTags'],
    });

    if (!entity) {
      throw new NotFoundException('Tag not found');
    }
    return entity;
  }

  async delete(tagId: string, user: UserEntity): Promise<TagEntity> {
    const entity = await this.findOne(tagId);
    const currentData = { ...entity };

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(PostJoinTagEntity)
        .where('tagId = :id', { id: tagId })
        .execute();

      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(TagEntity)
        .where('id = :id', { id: tagId })
        .execute();
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        err.message ? err.message : 'Error occurred',
      );
    } finally {
      await queryRunner.release();
    }
    return entity;
  }
}
