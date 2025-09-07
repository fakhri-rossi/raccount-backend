import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Transaction } from './schemas/transaction.schema';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { SearchTransactionDto } from './dto/search-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionService: TransactionsService) {}

  @Post()
  async create(@Body() dto: CreateTransactionDto): Promise<Transaction> {
    return this.transactionService.create(dto);
  }

  @Post('/search')
  async find(@Body() dto: SearchTransactionDto): Promise<Transaction[]> {
    return this.transactionService.find(dto);
  }

  @Get('/:id')
  async findById(@Param('id') id: string): Promise<Transaction | null> {
    return this.transactionService.findById(id);
  }

  @Patch('/:id')
  async updateOne(
    @Param('id') transactionId: string,
    @Body() dto: UpdateTransactionDto,
  ): Promise<Transaction | null> {
    return this.transactionService.updateOne(transactionId, dto);
  }

  @Delete('/:id')
  async deleteOne(
    @Param('id') transactionId: string,
  ): Promise<Transaction | null> {
    return this.transactionService.deleteOne(transactionId);
  }
}
