import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchAccountDto {
  @IsOptional()
  @ApiProperty({ required: false })
  @IsNumber()
  @Type(() => Number)
  code?: number;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsString()
  categoryId?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsString()
  groupId?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsString()
  name?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsNumber()
  @Type(() => Number)
  skip?: number;

  @IsOptional()
  @ApiProperty({ required: false })
  @IsNumber()
  @Type(() => Number)
  limit?: number;
}
