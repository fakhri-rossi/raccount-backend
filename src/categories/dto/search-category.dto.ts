import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchCategoryDto {
  @ApiProperty({ required: false, example: 'Asset' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false, example: 1 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  codePrefix?: number;

  @ApiProperty({ required: false, example: true })
  @IsBoolean()
  @IsOptional()
  isNormalBalanceDebit?: boolean;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  skip?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number;
}
