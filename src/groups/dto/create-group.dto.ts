import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ example: '6885f8e6e4b59765cd44958a' })
  @IsString()
  categoryId: string;

  @ApiProperty({ example: 'Non-Current Assets' })
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
