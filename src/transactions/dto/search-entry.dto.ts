import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchEntryDto {
  @IsString()
  @IsOptional()
  accountId?: string;

  @IsNumber()
  @IsOptional()
  debit?: number;

  @IsNumber()
  @IsOptional()
  credit?: number;
}
