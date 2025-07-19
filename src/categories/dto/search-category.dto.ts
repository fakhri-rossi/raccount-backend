import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchCategoryDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  codePrefix?: number;

  @IsBoolean()
  @IsOptional()
  isNormalBalanceDebit?: boolean;

  @IsNumber()
  @IsOptional()
  skip?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;
}
