import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SearchGroupDto {
  @ApiProperty({
    description: 'In-case sensitive, regex search',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: '6885f8e6e4b59765cd44958a', required: false })
  @IsString()
  @IsOptional()
  categoryId?: string;
}
