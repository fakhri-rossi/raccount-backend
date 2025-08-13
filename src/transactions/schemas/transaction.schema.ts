import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Date, HydratedDocument } from 'mongoose';
import { Entry } from './entry.schema';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Date })
  date: Date;

  @Prop()
  description?: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Entry' }] })
  entries: Entry[];
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
