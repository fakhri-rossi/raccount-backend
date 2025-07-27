import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from 'src/categories/schemas/category.schema';
import { Group } from 'src/groups/schemas/group.schema';

export type AccountDocument = HydratedDocument<Account>;

@Schema({ timestamps: true })
export class Account {
  @Prop({ required: true })
  code: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Group' })
  groupId?: Group;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: '' })
  categoryId: Category;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  isActive: boolean;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
