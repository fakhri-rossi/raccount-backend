import { Body, Controller, Post } from '@nestjs/common';
import { GroupService } from './groups.service';
import { Group } from './schemas/group.schema';
import { CreateGroupDto } from './dto/create-group.dto';

@Controller('groups')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Post()
  async create(@Body() createGroupDto: CreateGroupDto): Promise<Group> {
    return this.groupService.create(createGroupDto);
  }
}
