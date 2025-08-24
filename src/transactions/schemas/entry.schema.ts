import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Account } from 'src/accounts/schemas/account.schema';

export type EntryDocument = HydratedDocument<Entry>;

@Schema({ _id: false })
export class Entry {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
  })
  accountId: Account;

  @Prop({ required: true })
  debit: number;

  @Prop({ required: true })
  credit: number;
}

export const EntrySchema = SchemaFactory.createForClass(Entry);
