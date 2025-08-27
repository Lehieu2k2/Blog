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
import { UserEntity } from 'src/database/entities/user.entity';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { UserAuth } from 'src/decorators/http.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { UserCreateDto } from 'src/modules/user/dto/user-create.dto';
import { UserListDto } from 'src/modules/user/dto/user-list.dto';
import { UserUpdateDto } from 'src/modules/user/dto/user-update.dto';
import { UserService } from 'src/modules/user/user.service';

@ApiTags('User')
@Controller('user')
@Roles(UserRole.TYPE_ADMIN)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UserAuth()
  @ApiOkResponse({
    type: PageDto,
    description: 'Get all users',
  })
  async findAll(
    @AuthUser() user: UserEntity,
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() queries: UserListDto,
  ): Promise<PageDto<UserEntity>> {
    const [listItems, totalItems] = await this.userService.findAll(
      user,
      queries,
      pageOptionsDto,
    );

    return new PageDto<UserEntity>(
      listItems,
      new PageMetaDto({
        pageOptionsDto,
        totalItems,
      }),
    );
  }

  @Post('create')
  @UserAuth()
  @ApiOkResponse({
    type: UserCreateDto,
    description: 'Create user',
  })
  async create(@Body() body: UserCreateDto) {
    return await this.userService.create(body);
  }

  @Patch(':id')
  @UserAuth()
  @ApiOkResponse({
    type: UserUpdateDto,
    description: 'Update a User',
  })
  async update(
    @AuthUser() user: UserEntity,
    @Body() body: UserUpdateDto,
    @Param('id') id: string,
  ) {
    return await this.userService.update(id, body, user);
  }

  @Get(':id')
  @UserAuth()
  @ApiOkResponse({ description: ' Get a User' })
  async findOne(@AuthUser() user: UserEntity, @Param('id') id: string) {
    return await this.userService.findOne(id);
  }

  @Delete(':id')
  @UserAuth()
  @ApiOkResponse({ description: 'Delete a User' })
  async delete(@Param('id') id: string, @AuthUser() user: UserEntity) {
    return await this.userService.delete(id, user);
  }

  @Patch(':id/status')
  @UserAuth()
  @ApiOkResponse({
    description: 'Update status [Blocked, Un-Blocked] by id',
  })
  async updateStatus(@Param('id') id: string, @AuthUser() user: UserEntity) {
    return await this.userService.updateStatus(id, user);
  }

  @Patch(':id/ban')
  @UserAuth()
  @ApiOkResponse({
    description: 'Ban a user (Admin only)',
  })
  async banUser(@Param('id') id: string, @AuthUser() user: UserEntity) {
    return await this.userService.banUser(id, user);
  }

  @Patch(':id/unban')
  @UserAuth()
  @ApiOkResponse({
    description: 'Unban a user (Admin only)',
  })
  async unbanUser(@Param('id') id: string, @AuthUser() user: UserEntity) {
    return await this.userService.unbanUser(id, user);
  }
}
