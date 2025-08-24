import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Transaction } from './schemas/transaction.schema';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { SearchTransactionDto } from './dto/search-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionService: TransactionsService) {}

  @Post()
  async create(@Body() dto: CreateTransactionDto): Promise<Transaction> {
    return this.transactionService.create(dto);
  }

  @Get()
  async find(@Body() dto: SearchTransactionDto): Promise<Transaction[]> {
    return this.transactionService.find(dto);
  }

  @Get('/:id')
  async findById(@Param('id') id: string): Promise<Transaction | null> {
    return this.transactionService.findById(id);
  }
}
