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
import { GroupService } from './groups.service';
import { Group } from './schemas/group.schema';
import { CreateGroupDto } from './dto/create-group.dto';
import { SearchGroupDto } from './dto/search-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

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

  @Patch('/:id')
  async updateOne(
    @Param('id') groupId: string,
    @Body() dto: UpdateGroupDto,
  ): Promise<Group | null> {
    return this.groupService.updateOne(groupId, dto);
  }

  @Delete('/:id')
  async deleteOne(@Param('id') groupId: string): Promise<Group | null> {
    return this.groupService.deleteOne(groupId);
  }
}
