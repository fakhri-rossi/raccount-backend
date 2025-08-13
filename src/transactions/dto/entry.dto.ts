import { IsNumber, IsString } from 'class-validator';

export class EntryDto {
  @IsString()
  accountId: string;

  @IsNumber()
  debit: number;

  @IsNumber()
  credit: number;
}
