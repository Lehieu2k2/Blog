import { Controller, Get, Query, Param, Delete } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PageDto } from '../../common/dto/page.dto';
import { TagEntity } from 'src/database/entities/tag.entity';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { UserEntity } from 'src/database/entities/user.entity';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { UserAuth } from '../../decorators/http.decorator';
import { TagService } from 'src/modules/tag/tag.service';
import { TagListDto } from 'src/modules/tag/dto/tag-list.dto';

@Controller('tags')
@ApiTags('Tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @UserAuth()
  @ApiOkResponse({
    type: PageDto,
    description: 'List Tags',
  })
  async index(
    @AuthUser() user: UserEntity,
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() queries: TagListDto,
  ): Promise<PageDto<TagEntity>> {
    const [listItems, totalItems] = await this.tagService.findAll(
      user,
      queries,
      pageOptionsDto,
    );

    return new PageDto<TagEntity>(
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
    description: 'Get a Tag by id',
  })
  async show(@Param('id') id: string) {
    return await this.tagService.findOne(id);
  }

  @Delete(':id')
  @UserAuth()
  @ApiOkResponse({
    description: 'Delete a tag',
  })
  async delete(@Param('id') id: string, @AuthUser() user: UserEntity) {
    return await this.tagService.delete(id, user);
  }
}
