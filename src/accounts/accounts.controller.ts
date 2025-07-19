import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './schemas/account.schema';
import { AccountType } from 'src/common/enums/accountType.enum';

@Controller('accounts')
export class AccountsController {
  constructor(private accountService: AccountsService) {}

  @Post()
  async create(@Body() createAccountDto: CreateAccountDto): Promise<Account> {
    return this.accountService.create(createAccountDto);
  }

  @Get()
  async search(
    @Query('code') code?: string,
    @Query('type') type?: AccountType,
    @Query('parentId') parentId?: string,
    @Query('level') level?: number,
    @Query('name') name?: string,
    @Query('skip') skip?: number,
    @Query('limit') limit?: number,
  ): Promise<Account[]> {
    return this.accountService.find({
      code,
      type,
      parentId,
      level,
      skip,
      limit,
      name,
    });
  }

  @Get('/:id')
  async findAcccountById(
    @Param('id') accountId: string,
  ): Promise<Account | null> {
    return this.accountService.findById(accountId);
  }
}
