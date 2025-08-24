import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Date, HydratedDocument } from 'mongoose';
import { Entry, EntrySchema } from './entry.schema';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: Date })
  date: Date;

  @Prop()
  description?: string;

  @Prop({ type: [EntrySchema], default: [] })
  entries: Entry[];

  @Prop({ required: true })
  totalAmount: number;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
