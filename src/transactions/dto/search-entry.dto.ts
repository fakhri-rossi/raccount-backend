import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchEntryDto {
  @ApiProperty({ example: '6885f9b1e4b59765cd449596', required: false })
  @IsString()
  @IsOptional()
  accountId?: string;

  @ApiProperty({ example: 100, required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  startDebit?: number;

  @ApiProperty({ example: 10000, required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  endDebit?: number;

  @ApiProperty({ example: 100, required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  startCredit?: number;

  @ApiProperty({ example: 10000, required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  endCredit?: number;
}
