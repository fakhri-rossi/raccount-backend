import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsNumber()
  codePrefix: number;

  @IsBoolean()
  isNormalBalanceDebit: boolean;
}
