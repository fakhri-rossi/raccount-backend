import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { SearchEntryDto } from './search-entry.dto';

export class SearchTransactionDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  startAmount?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  endAmount?: number;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  skip?: number;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @ValidateNested({ each: true })
  @Type(() => SearchEntryDto)
  entries: SearchEntryDto[];
}
