import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { AccountType } from 'src/common/enums/accountType.enum';

export type AccountDocument = HydratedDocument<Account>;

@Schema({ timestamps: true })
export class Account {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  type: AccountType;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Account' })
  parent_id: Account;

  @Prop({ required: true })
  level: number;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  isNormalBalanceDebit: boolean;

  @Prop({ required: true })
  isActive: boolean;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
