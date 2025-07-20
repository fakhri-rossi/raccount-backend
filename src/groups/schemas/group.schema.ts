import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Account } from 'src/accounts/schemas/account.schema';
import { Category } from 'src/categories/schemas/category.schema';

export type GroupDocument = HydratedDocument<Group>;

@Schema({ timestamps: true })
export class Group {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  })
  categoryId: Category;

  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }] })
  accounts: Account[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);
