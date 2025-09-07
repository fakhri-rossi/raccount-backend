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
import { ApiProperty } from '@nestjs/swagger';

export class SearchTransactionDto {
  @ApiProperty({ example: 100, required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  startAmount?: number;

  @ApiProperty({ example: 10000, required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  endAmount?: number;

  @ApiProperty({ example: '2025-08-17T00:00:00.000+00:00', required: false })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({ example: '2025-09-17T00:00:00.000+00:00', required: false })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @ApiProperty({ example: 'pay', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false, example: 0 })
  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  skip?: number;

  @ApiProperty({ required: false, example: 20 })
  @IsNumber()
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    type: () => SearchEntryDto,
    isArray: true,
    example: [
      { accountId: '6885f9b1e4b59765cd449596', startDebit: 0, endDebit: 10000 },
      {
        accountId: '6885fcb8e4b59765cd4495a0',
        startCredit: 0,
        endCredit: 10000,
      },
    ],
  })
  @ValidateNested({ each: true })
  @Type(() => SearchEntryDto)
  entries: SearchEntryDto[];
}
