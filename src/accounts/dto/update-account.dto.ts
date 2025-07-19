import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { AccountType } from 'src/common/enums/accountType.enum';

export class UpdateAccountDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  parentId?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isNormalBalanceDebit?: boolean;
}
