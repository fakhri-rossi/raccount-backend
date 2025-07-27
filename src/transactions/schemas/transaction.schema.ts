import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { Date } from 'mongoose';
import { Entry } from './entry.schema';

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  date: Date;

  @Prop()
  description?: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Entry' }] })
  entries: Entry[];
}
