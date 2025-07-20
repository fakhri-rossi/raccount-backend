import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from './schemas/group.schema';
import { GroupService } from './groups.service';
import { GroupController } from './groups.controller';
import {
  Category,
  CategorySchema,
} from 'src/categories/schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  providers: [GroupService],
  controllers: [GroupController],
})
export class GroupsModule {}
