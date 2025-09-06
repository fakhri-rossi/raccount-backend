import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './schemas/account.schema';
import { SearchAccountDto } from './dto/search-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

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
  async findById(@Param('id') accountId: string): Promise<Account | null> {
    return this.accountService.findById(accountId);
  }

  @Patch('/:id')
  async updateOne(
    @Param('id') accountId: string,
    @Body() dto: UpdateAccountDto,
  ): Promise<Account | null> {
    return this.accountService.updateOne(accountId, dto);
  }

  @Delete('/:id')
  async deleteOne(@Param('id') accountId: string): Promise<Account | null> {
    return this.accountService.deleteOne(accountId);
  }
}
