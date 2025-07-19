import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { AccountType } from 'src/common/enums/accountType.enum';

export class CreateAccountDto {
  @IsString()
  code: string;

  @IsEnum(AccountType)
  type: AccountType;

  @IsString()
  @IsOptional()
  parentId?: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  isNormalBalanceDebit: boolean;
}
