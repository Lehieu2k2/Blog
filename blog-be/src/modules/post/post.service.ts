import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PostStatus } from 'src/constant/db/post-status';
import { ResourceType } from 'src/constant/resource-type';
import { CategoryEntity } from 'src/database/entities/category.entity';
import { PostEntity, TABLE_POSTS } from 'src/database/entities/post.entity';
import { PostJoinTagEntity } from 'src/database/entities/postJoinTag.entity';
import { TagEntity } from 'src/database/entities/tag.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { fileMapper } from 'src/helpers/file-mapper.helper';
import { generateSlug } from 'src/helpers/generator.helper';
import { PostCreateDto } from 'src/modules/post/dto/post-create.dto';
import { PostListDto } from 'src/modules/post/dto/post-list.dto';
import { PostUpdateDto } from 'src/modules/post/dto/post-update.dto';
import { GeneratorService } from 'src/shared/services/generator.service';
import { DataSource, Not, Repository } from 'typeorm';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class PostService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(TagEntity)
    private tagRepository: Repository<TagEntity>,
    @InjectRepository(PostJoinTagEntity)
    private postJoinTagRepository: Repository<PostJoinTagEntity>,
    private generatorService: GeneratorService,
    private uploadService: UploadService,
  ) {}
  async findAll(
    user: UserEntity,
    queries: PostListDto,
    pageOptionsDto: PageOptionsDto,
  ): Promise<[PostEntity[], number]> {
    const queryBuilder = this.postRepository.createQueryBuilder(TABLE_POSTS);

    const condition = await this.generateConditionFinds(user, queries);
    if (condition) {
      queryBuilder.where(condition, { user, queries });
    }
    const [data, total] = await queryBuilder
      .leftJoinAndSelect(`${TABLE_POSTS}.localFile`, 'localFile')
      .leftJoinAndSelect(`${TABLE_POSTS}.category`, 'category')
      .leftJoinAndSelect(`${TABLE_POSTS}.postJoinTags`, 'postJoinTags')
      .leftJoinAndSelect(`postJoinTags.tag`, 'tag')
      .orderBy(
        queries.orderField
          ? `${TABLE_POSTS}.${queries.orderField}`
          : `${TABLE_POSTS}.createdAt`,
        queries.orderType === 'asc' ? 'ASC' : 'DESC',
      )
      .take(queries.limit ? queries.limit : pageOptionsDto.limit)
      .skip(pageOptionsDto.offset)
      .getManyAndCount();
    return [data, total];
  }

  async generateConditionFinds(user: UserEntity, queries: PostListDto) {
    let condition = '';
    if (typeof queries.status !== 'undefined') {
      if (condition) condition += ` AND `;
      condition += `${TABLE_POSTS}.status = ${queries.status}`;
    }

    if (queries.keyword) {
      if (condition) {
        condition += ' AND (';
      } else {
        condition += '(';
      }
      const keyword = `'%${queries.keyword}%'`;
      condition += ` LOWER(${TABLE_POSTS}.title) LIKE LOWER(${keyword})`;
      condition += ` OR LOWER(${TABLE_POSTS}.slug) LIKE LOWER(${keyword})`;
      condition += ` OR LOWER(${TABLE_POSTS}.description) LIKE LOWER(${keyword})`;
      condition += ` OR LOWER(${TABLE_POSTS}.content) LIKE LOWER(${keyword})`;
      condition += ` OR LOWER(category.title) LIKE LOWER(${keyword})`;
      condition += ')';
    }
    return condition;
  }

  async findOne(id: string): Promise<PostEntity> {
    const entity = await this.postRepository.findOne({
      where: { id: id },
      relations: ['rates', 'localFile', 'category', 'postJoinTags.tag'],
    });
    if (!entity) {
      throw new NotFoundException('Post not found');
    }
    entity['totalRate'] = entity.rates.length || 0;
    entity['averageRate'] = entity.rates.length
      ? entity.rates.reduce((sum, rate) => sum + (rate.star || 0), 0) /
        entity.rates.length
      : 0;
    delete entity.rates;
    return entity;
  }

  async create(
    attrs: Partial<PostCreateDto>,
    user: UserEntity,
  ): Promise<PostEntity> {
    // Check if title already exists
    const isTitle = await this.postRepository.findOneBy({
      title: attrs.title,
    });
    if (isTitle) {
      throw new BadRequestException('Post with this title already exists');
    }

    const slug = generateSlug(attrs.slug || attrs.title);
    const isSlug = await this.postRepository.findOneBy({
      slug: slug,
    });
    if (isSlug) {
      throw new BadRequestException('Post with this slug already exists');
    }

    // Validate category exists
    const category = await this.categoryRepository.findOneBy({
      id: attrs.categoryId,
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const listFiles = attrs.file;
    delete attrs.file;

    const listTag = attrs.tag?.split(',') || [];
    delete attrs.tag;

    let thumbnailId;

    // Handle file upload for thumbnail
    if (
      listFiles &&
      typeof listFiles[0].originalname !== 'undefined' &&
      listFiles[0].originalname.match(/\.(jpg|jpeg|png|gif|JPEG|JPG|PNG|GIF)$/)
    ) {
      const mappedFile = fileMapper({
        file: listFiles[0],
        type: ResourceType.IMAGE,
      });
      const uploadedFile = await this.uploadService.upload(
        {
          file: mappedFile,
          type: ResourceType.IMAGE,
        },
        `${slug}`,
        user.id,
      );
      thumbnailId = uploadedFile.id;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const entityId = this.generatorService.generateSnowflakeId();

    try {
      await queryRunner.startTransaction();

      // Handle tags
      if (listTag && listTag.length) {
        const tagExitInfos = [];
        const postJoinTagRelationInfo = [];

        for (const tag of listTag) {
          const tagExit = await this.tagRepository.findOneBy({
            title: tag,
          });

          if (tag) {
            if (!tagExit) {
              // Create new tag
              const tagId = this.generatorService.generateSnowflakeId();
              tagExitInfos.push(
                await this.tagRepository.create({
                  id: tagId,
                  slug: generateSlug(tag),
                  title: tag,
                }),
              );
              postJoinTagRelationInfo.push(
                await this.postJoinTagRepository.create({
                  id: this.generatorService.generateSnowflakeId(),
                  postId: entityId,
                  tagId: tagId,
                }),
              );
            } else {
              // Use existing tag
              postJoinTagRelationInfo.push(
                await this.postJoinTagRepository.create({
                  id: this.generatorService.generateSnowflakeId(),
                  postId: entityId,
                  tagId: tagExit.id,
                }),
              );
            }
          }
        }

        // Save new tags if any
        if (tagExitInfos.length) {
          await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(TagEntity)
            .values(tagExitInfos)
            .updateEntity(false)
            .execute();
        }

        // Save post-tag relationships
        if (postJoinTagRelationInfo.length) {
          await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(PostJoinTagEntity)
            .values(postJoinTagRelationInfo)
            .updateEntity(false)
            .execute();
        }
      }

      // Create the post
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(PostEntity)
        .values({
          id: entityId,
          thumbnailId: thumbnailId,
          slug: slug,
          userId: user.id,
          status: attrs.status || PostStatus.DRAFT,
          ...attrs,
        })
        .updateEntity(false)
        .execute();

      await queryRunner.commitTransaction();

      // Return the created post with relations
      return await this.findOne(entityId);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        err.message ? err.message : 'Error occurred while creating post',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    id: string,
    attrs: Partial<PostUpdateDto>,
    user: UserEntity,
  ): Promise<PostEntity> {
    const entity = await this.postRepository.findOneBy({
      id: id,
    });
    if (!entity) {
      throw new NotFoundException('Post not found');
    }

    // Check title uniqueness if title is being changed
    if (attrs.title && attrs.title !== entity.title) {
      const isTitle = await this.postRepository.findOneBy({
        title: attrs.title,
      });
      if (isTitle) {
        throw new BadRequestException('Post with this title already exists');
      }
    }

    // Check slug uniqueness if slug is being changed
    if (attrs.slug && attrs.slug !== entity.slug) {
      const slug = generateSlug(attrs.slug || attrs.title);
      const isSlug = await this.postRepository.findOneBy({
        slug: slug,
        id: Not(id),
      });
      if (isSlug) {
        throw new BadRequestException('Post with this slug already exists');
      }
      attrs.slug = slug;
    }

    // Check category exists if categoryId is being changed
    if (attrs.categoryId && attrs.categoryId !== entity.categoryId) {
      const category = await this.categoryRepository.findOneBy({
        id: attrs.categoryId,
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    const listFiles = attrs.file;
    delete attrs.file;

    const listTag = attrs.tag?.split(',') || [];
    delete attrs.tag;

    // Handle file upload for thumbnail
    if (
      listFiles &&
      typeof listFiles[0].originalname !== 'undefined' &&
      listFiles[0].originalname.match(/\.(jpg|jpeg|png|gif|JPEG|JPG|PNG|GIF)$/)
    ) {
      const mappedFile = fileMapper({
        file: listFiles[0],
        type: ResourceType.IMAGE,
      });
      const uploadedFile = await this.uploadService.upload(
        {
          file: mappedFile,
          type: ResourceType.IMAGE,
        },
        `${attrs.slug || entity.slug}`,
        user.id,
      );
      entity.thumbnailId = uploadedFile.id;
    }

    const currentData = { ...entity };
    Object.assign(entity, {
      ...attrs,
      userId: user.id, // updatedId equivalent
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();

      // Update the post
      await queryRunner.manager
        .createQueryBuilder()
        .update(PostEntity)
        .set(entity)
        .where('id = :id', { id: entity.id })
        .execute();

      // Delete existing post-tag relationships
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(PostJoinTagEntity)
        .where('postId = :id', { id: id })
        .execute();

      // Handle tags
      if (listTag && listTag.length) {
        const tagExitInfos = [];
        const postJoinTagRelationInfo = [];

        for (const tag of listTag) {
          const tagExit = await this.tagRepository.findOneBy({
            title: tag,
          });

          if (tag) {
            if (!tagExit) {
              // Create new tag
              const tagId = this.generatorService.generateSnowflakeId();
              tagExitInfos.push(
                await this.tagRepository.create({
                  id: tagId,
                  slug: generateSlug(tag),
                  title: tag,
                }),
              );
              postJoinTagRelationInfo.push(
                await this.postJoinTagRepository.create({
                  id: this.generatorService.generateSnowflakeId(),
                  postId: entity.id,
                  tagId: tagId,
                }),
              );
            } else {
              // Use existing tag
              postJoinTagRelationInfo.push(
                await this.postJoinTagRepository.create({
                  id: this.generatorService.generateSnowflakeId(),
                  postId: entity.id,
                  tagId: tagExit.id,
                }),
              );
            }
          }
        }

        // Save new tags if any
        if (tagExitInfos.length) {
          await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(TagEntity)
            .values(tagExitInfos)
            .updateEntity(false)
            .execute();
        }

        // Save post-tag relationships
        if (postJoinTagRelationInfo.length) {
          await queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(PostJoinTagEntity)
            .values(postJoinTagRelationInfo)
            .updateEntity(false)
            .execute();
        }
      }

      await queryRunner.commitTransaction();

      // Return the updated post with relations
      return await this.findOne(id);
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        err.message ? err.message : 'Error occurred while updating post',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async delete(postId: string, user: UserEntity): Promise<PostEntity> {
    const entity = await this.findOne(postId);
    const currentData = { ...entity };

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(PostJoinTagEntity)
        .where('postId = :id', { id: postId })
        .execute();

      await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from(PostEntity)
        .where('id = :id', { id: postId })
        .execute();

      await queryRunner.commitTransaction();
      return currentData;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(
        err.message ? err.message : 'Error occurred',
      );
    } finally {
      await queryRunner.release();
    }
  }
}
