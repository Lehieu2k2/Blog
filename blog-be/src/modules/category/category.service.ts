import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { CategoryStatus } from 'src/constant/db/category-status';
import {
  CategoryEntity,
  TABLE_CATEGORIES,
} from 'src/database/entities/category.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { addRecursiveChildren } from 'src/helpers/common.helper';
import { generateSlug } from 'src/helpers/generator.helper';
import { CategoryCreateDto } from 'src/modules/category/dto/category-create.dto';
import { CategoryListDto } from 'src/modules/category/dto/category-list.dto';
import { CategoryUpdateDto } from 'src/modules/category/dto/category-update.dto';
import { GeneratorService } from 'src/shared/services/generator.service';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly generatorService: GeneratorService,
  ) {}

  async findAll(
    user: UserEntity,
    queries: CategoryListDto,
    pageOptionsDto: PageOptionsDto,
  ): Promise<[CategoryEntity[], number]> {
    const queryBuilder =
      this.categoryRepository.createQueryBuilder(TABLE_CATEGORIES);

    const condition = await this.generateConditionFinds(user, queries);
    if (condition) {
      queryBuilder.where(condition, { user, queries });
    }

    queryBuilder.orderBy(
      queries.orderField
        ? `${TABLE_CATEGORIES}.${queries.orderField}`
        : `${TABLE_CATEGORIES}.createdAt`,
      queries.orderType === 'asc' ? 'ASC' : 'DESC',
    );
    const data = await queryBuilder.getMany();
    const rootCategories = data.filter(
      (item) =>
        !item.parentId ||
        !data.map((category) => category.id).includes(item.parentId),
    );
    addRecursiveChildren(rootCategories, data);
    const offset = pageOptionsDto.offset;
    const limit = queries.limit || pageOptionsDto.limit;
    const paginatedData = rootCategories.slice(offset, offset + limit);
    const totalPagination = rootCategories.length;
    return [paginatedData, totalPagination];
  }

  async generateConditionFinds(user: UserEntity, queries: CategoryListDto) {
    let condition = '';
    // condition += `${TABLE_CATEGORIES}.parentId IS NULL`;
    if (typeof queries.status !== 'undefined') {
      if (condition) condition += ` AND `;
      condition += `${TABLE_CATEGORIES}.status = ${queries.status}`;
    }

    if (queries.keyword) {
      if (condition) {
        condition += ' AND (';
      } else {
        condition += '(';
      }
      const keyword = `'%${queries.keyword}%'`;
      condition += ` LOWER(${TABLE_CATEGORIES}.title) LIKE LOWER(${keyword})`;
      condition += ` OR LOWER(${TABLE_CATEGORIES}.slug) LIKE LOWER(${keyword})`;
      condition += ')';
    }
    return condition;
  }

  async findOne(id: string): Promise<CategoryEntity> {
    const entity = await this.categoryRepository.findOne({
      where: { id: id },
    });

    if (!entity) {
      throw new NotFoundException('Category not found');
    }
    return entity;
  }

  async create(
    attrs: CategoryCreateDto,
    user: UserEntity,
  ): Promise<CategoryEntity> {
    const slug = generateSlug(attrs.slug || attrs.title);

    // Check if slug already exists
    const existingSlug = await this.categoryRepository.findOneBy({ slug });
    if (existingSlug) {
      throw new BadRequestException(
        `Category with slug '${slug}' already exists`,
      );
    }

    // Validate parent category if provided
    // if (attrs.parentId) {
    //   const parentCategory = await this.categoryRepository.findOneBy({
    //     id: attrs.parentId,
    //   });
    //   if (!parentCategory) {
    //     throw new BadRequestException(
    //       `Parent category with ID ${attrs.parentId} not found`,
    //     );
    //   }
    // }

    const entityId = this.generatorService.generateSnowflakeId();

    const entity = this.categoryRepository.create({
      id: entityId,
      ...attrs,
      slug: slug,
      status: CategoryStatus.ACTIVE,
    });

    await this.categoryRepository.save(entity);
    return this.findOne(entityId);
  }

  async update(
    id: string,
    attrs: Partial<CategoryUpdateDto>,
    user: UserEntity,
  ): Promise<CategoryEntity> {
    const entity = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Check slug uniqueness if title or slug is being updated
    if (attrs.title || attrs.slug) {
      const newSlug = generateSlug(attrs.slug || attrs.title || entity.title);

      if (newSlug !== entity.slug) {
        const existingSlug = await this.categoryRepository.findOne({
          where: { slug: newSlug },
        });

        if (existingSlug && existingSlug.id !== id) {
          throw new BadRequestException(
            `Category with slug '${newSlug}' already exists`,
          );
        }

        entity.slug = newSlug;
      }
    }

    // Validate parent category if being updated
    // if (attrs.parentId !== undefined) {
    //   if (attrs.parentId) {
    //     // Check if parent exists
    //     const parentCategory = await this.categoryRepository.findOneBy({
    //       id: attrs.parentId,
    //     });
    //     if (!parentCategory) {
    //       throw new BadRequestException(
    //         `Parent category with ID ${attrs.parentId} not found`,
    //       );
    //     }

    //     // Prevent circular reference (category cannot be its own parent or child)
    //     if (attrs.parentId === id) {
    //       throw new BadRequestException('Category cannot be its own parent');
    //     }
    //   }
    //   entity.parentId = attrs.parentId || null;
    // }

    Object.assign(entity, {
      ...attrs,
      updatedId: user.id,
      slug: generateSlug(attrs.title),
    });

    await this.categoryRepository.save(entity);
    return entity;
  }

  async delete(categoryId: string, user: UserEntity): Promise<CategoryEntity> {
    const entity = await this.findOne(categoryId);
    if (!entity) {
      throw new NotFoundException('Category not found');
    }

    // Check if category has children
    const children = await this.categoryRepository.find({
      where: { parentId: categoryId },
    });

    if (children.length > 0) {
      throw new BadRequestException(
        'Cannot delete category that has child categories',
      );
    }

    await this.categoryRepository.remove(entity);
    return entity;
  }

  async updateStatus(id: string, user: UserEntity): Promise<CategoryEntity> {
    const entity = await this.categoryRepository.findOne({
      where: { id: id },
    });
    if (!entity) {
      throw new NotFoundException('Category not found');
    }
    if (entity.status === null || entity.status === undefined) {
      entity.status = CategoryStatus.ACTIVE;
    } else if (entity.status === CategoryStatus.ACTIVE) {
      entity.status = CategoryStatus.INACTIVE;
    } else {
      entity.status = CategoryStatus.ACTIVE;
    }

    await this.categoryRepository.save(entity);
    // log
    return entity;
  }
}
