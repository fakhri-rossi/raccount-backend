import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class EntryDto {
  @ApiProperty({ example: '6885f9b1e4b59765cd449596' })
  @IsString()
  accountId: string;

  @ApiProperty({ example: 10000 })
  @IsNumber()
  debit: number;

  @ApiProperty({ example: 0 })
  @IsNumber()
  credit: number;
}
