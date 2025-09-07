import { IsDate, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Entry } from '../schemas/entry.schema';
import { EntryDto } from './entry.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({ example: 'Pay Debt' })
  @IsString()
  name: string;

  @ApiProperty({ example: '2025-08-17T00:00:00.000+00:00' })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: () => EntryDto,
    isArray: true,
    example: [
      { accountId: '6885f9b1e4b59765cd449596', debit: 1000, credit: 0 },
      { accountId: '7655f9b1e4b59765cd449543', debit: 0, credit: 1000 },
    ],
  })
  @ValidateNested({ each: true })
  @Type(() => EntryDto)
  entries: Entry[];
}
