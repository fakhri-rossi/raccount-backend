import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './schemas/account.schema';
import { AccountType } from 'src/common/enums/accountType.enum';
import { SearchAccountDto } from './dto/search-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private accountService: AccountsService) {}

  @Post()
  async create(@Body() createAccountDto: CreateAccountDto): Promise<Account> {
    return this.accountService.create(createAccountDto);
  }

  @Get()
  async search(@Query() query: SearchAccountDto): Promise<Account[]> {
    return this.accountService.find(query);
  }

  @Get('/:id')
  async findAcccountById(
    @Param('id') accountId: string,
  ): Promise<Account | null> {
    return this.accountService.findById(accountId);
  }
}
