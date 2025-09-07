import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { EntryDto } from './entry.dto';

export class SearchEntryDto extends PartialType(EntryDto) {}
