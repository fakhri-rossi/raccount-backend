import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Asset', description: 'The category of account' })
  @IsString()
  name: string;

  @ApiProperty({
    example: '1',
    description:
      'Between 1-9. The number would be the prefix of account code of its accounts. example: 1xxx, 2xxx, etc.',
  })
  @IsNumber()
  codePrefix: number;

  @ApiProperty({
    example: true,
    description: 'True: debit up, credit down. False: debit down, credit up.',
  })
  @IsBoolean()
  isNormalBalanceDebit: boolean;
}
