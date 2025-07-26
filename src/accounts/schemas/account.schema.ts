import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from 'src/categories/schemas/category.schema';
import { AccountType } from 'src/common/enums/accountType.enum';
import { Group } from 'src/groups/schemas/group.schema';

export type AccountDocument = HydratedDocument<Account>;

@Schema({ timestamps: true })
export class Account {
  @Prop({ required: true })
  code: number;

  // @Prop({ required: true, enum: AccountType })
  // type: string;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Account' })
  // parentId: Account;

  // @Prop({ required: true })
  // level: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Group' })
  groupId?: Group;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: '' })
  categoryId: Category;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  // @Prop({ required: true })
  // isNormalBalanceDebit: boolean;

  @Prop({ required: true })
  isActive: boolean;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
