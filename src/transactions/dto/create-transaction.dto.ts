import { IsDate, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Entry } from '../schemas/entry.schema';
import { EntryDto } from './entry.dto';
import { Type } from 'class-transformer';

export class CreateTransactionDto {
  @IsString()
  name: string;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsString()
  @IsOptional()
  description?: string;

  @ValidateNested({ each: true })
  @Type(() => EntryDto)
  entries: Entry[];
}
