import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({ example: 1001 })
  @IsNumber()
  code: number;

  @ApiProperty({ example: '6885f8e6e4b59765cd44958a' })
  @IsString()
  categoryId: string;

  @ApiProperty({ required: false, example: '6885f8e6e4b59765cd44958a' })
  @IsString()
  @IsOptional()
  groupId?: string;

  @ApiProperty({ example: 'Bank Balance' })
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
