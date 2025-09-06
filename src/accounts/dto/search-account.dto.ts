import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchAccountDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  code?: number;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  groupId?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  skip?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number;
}
