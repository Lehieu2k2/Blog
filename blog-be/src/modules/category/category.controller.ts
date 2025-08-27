import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { UserRole } from 'src/constant/db/user-role';
import { CategoryEntity } from 'src/database/entities/category.entity';
import { UserEntity } from 'src/database/entities/user.entity';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { UserAuth } from 'src/decorators/http.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { CategoryService } from './category.service';
import { CategoryCreateDto } from './dto/category-create.dto';
import { CategoryListDto } from './dto/category-list.dto';
import { CategoryUpdateDto } from './dto/category-update.dto';

@ApiTags('Category')
@Controller('category')
@Roles(UserRole.TYPE_ADMIN)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @UserAuth()
  @ApiOkResponse({
    type: PageDto,
    description: 'List Categories',
  })
  async index(
    @AuthUser() user: UserEntity,
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() queries: CategoryListDto,
  ): Promise<PageDto<CategoryEntity>> {
    const [listItems, totalItems] = await this.categoryService.findAll(
      user,
      queries,
      pageOptionsDto,
    );

    return new PageDto<CategoryEntity>(
      listItems,
      new PageMetaDto({
        pageOptionsDto,
        totalItems,
      }),
    );
  }

  @Get(':id')
  @UserAuth()
  @ApiOkResponse({
    description: 'Get a Category by id',
  })
  async show(@Param('id') id: string) {
    return await this.categoryService.findOne(id);
  }

  @Post()
  @UserAuth()
  @ApiOkResponse({
    type: CategoryCreateDto,
    description: 'Create a new category',
  })
  async create(
    @Body() body: CategoryCreateDto,
    @AuthUser() user: UserEntity,
  ) {
    return await this.categoryService.create(body, user);
  }

  @Patch(':id')
  @UserAuth()
  @ApiOkResponse({
    type: CategoryUpdateDto,
    description: 'Update category',
  })
  async update(
    @Param('id') id: string,
    @Body() body: CategoryUpdateDto,
    @AuthUser() user: UserEntity,
  ) {
    return await this.categoryService.update(id, body, user);
  }

  @Delete(':id')
  @UserAuth()
  @ApiOkResponse({
    description: 'Delete a category',
  })
  async delete(@Param('id') id: string, @AuthUser() user: UserEntity) {
    return await this.categoryService.delete(id, user);
  }

  @Patch('/:id/status')
  @UserAuth()
  @ApiOkResponse({
    description: 'Update status by id',
  })
  async updateStatus(@Param('id') id: string, @AuthUser() user: UserEntity) {
    return await this.categoryService.updateStatus(id, user);
  }
}
