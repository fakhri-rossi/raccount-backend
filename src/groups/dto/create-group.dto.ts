import { IsOptional, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  categoryId: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
