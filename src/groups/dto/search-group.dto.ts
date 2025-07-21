import { IsOptional, IsString } from 'class-validator';

export class SearchGroupDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;
}
