import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GroupService } from './groups.service';
import { Group } from './schemas/group.schema';
import { CreateGroupDto } from './dto/create-group.dto';
import { SearchGroupDto } from './dto/search-group.dto';

@Controller('groups')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Post()
  async create(@Body() createGroupDto: CreateGroupDto): Promise<Group> {
    return this.groupService.create(createGroupDto);
  }

  @Get()
  async search(@Query() query: SearchGroupDto): Promise<Group[]> {
    const { name, categoryId } = query;
    return this.groupService.find({ name, categoryId });
  }

  @Get('/:id')
  async findById(@Param('id') id: string): Promise<Group | null> {
    return this.groupService.findById(id);
  }
}
