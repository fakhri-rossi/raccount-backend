import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsNumber()
  code: number;

  @IsString()
  categoryId: string;

  @IsString()
  @IsOptional()
  groupId?: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
