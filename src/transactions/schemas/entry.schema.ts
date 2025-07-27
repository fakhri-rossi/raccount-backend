import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Account } from 'src/accounts/schemas/account.schema';

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
