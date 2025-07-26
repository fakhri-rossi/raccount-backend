import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, AccountSchema } from './schemas/account.schema';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import {
  Category,
  CategorySchema,
} from 'src/categories/schemas/category.schema';
import { Group, GroupSchema } from 'src/groups/schemas/group.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Account.name,
        schema: AccountSchema,
      },
      {
        name: Category.name,
        schema: CategorySchema,
      },
      {
        name: Group.name,
        schema: GroupSchema,
      },
    ]),
  ],
  providers: [AccountsService],
  controllers: [AccountsController],
})
export class AccountsModule {}
