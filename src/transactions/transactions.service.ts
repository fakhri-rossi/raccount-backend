import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { Connection, FilterQuery, isValidObjectId, Model } from 'mongoose';
import { Entry } from './schemas/entry.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Account } from 'src/accounts/schemas/account.schema';
import { SearchTransactionDto } from './dto/search-transaction.dto';
import { SearchEntryDto } from './dto/search-entry.dto';
import { validateObjectId } from 'src/common/utils/id.util';
import { EntryDto } from './dto/entry.dto';
import { UpdateAccountDto } from 'src/accounts/dto/update-account.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectModel(Entry.name) private entryModel: Model<Entry>,
    @InjectModel(Account.name) private accountModel: Model<Account>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async create({
    name,
    date,
    description,
    entries,
  }: CreateTransactionDto): Promise<Transaction> {
    await this.validateEachEntry(entries);

    // Validate the balance of amount of debits and credits, they have to be the same!
    // debit === credit
    const debitTotal = this.getTotal(entries, 'debit');
    const creditTotal = this.getTotal(entries, 'credit');

    if (debitTotal !== creditTotal) {
      throw new BadRequestException(
        `Debit and credit are not balance!\nDebit Total: ${debitTotal}\nCredit Total: ${creditTotal}`,
      );
    }

    const newEntries: EntryDto[] = entries.map((i) => ({
      accountId: i.accountId,
      credit: i.credit,
      debit: i.debit,
    }));

    const newTransaction = new this.transactionModel({
      name,
      date,
      description,
      entries: newEntries,
      totalAmount: debitTotal,
    });

    return newTransaction.save();
  }

  async find(query: SearchTransactionDto): Promise<Transaction[]> {
    const {
      name,
      startAmount,
      endAmount,
      startDate,
      endDate,
      entries,
      limit = 30,
      skip = 0,
    } = query;

    const filter: FilterQuery<TransactionDocument> = {};

    if (name) filter.name = { $regex: name, $options: 'i' };

    if (startAmount) filter.totalAmount = { $gte: startAmount };

    if (endAmount) filter.totalAmount = { $lte: endAmount };

    if (startDate) filter.date = { $gte: startDate };

    if (endDate) filter.date = { $lte: endDate };

    if (entries && entries[0]) {
      const matchEntries = this.filterByEntries(entries);

      filter.entries = { $all: matchEntries };
    }

    return await this.transactionModel.find(filter).limit(limit).skip(skip);
  }

  async findById(id: string): Promise<Transaction | null> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid object id');
    }

    const res = await this.transactionModel.findById(id).exec();

    if (!res) {
      throw new NotFoundException('Transaction id is not found');
    }

    return res;
  }

  private filterByEntries(entries: SearchEntryDto[]) {
    const matchEntries = entries.map((i) => {
      const elemMatch: any = {
        accountId: i.accountId,
      };

      // Validate: only have debit or credit range at once
      const hasDebit = i.startDebit || i.endDebit;
      const hasCredit = i.startCredit || i.endCredit;

      if (hasDebit && hasCredit) {
        throw new BadRequestException(
          'May only input one: Credit range or Debit range',
        );
      }

      if (hasDebit) {
        elemMatch.debit = {};
        if (i.startDebit) {
          elemMatch.debit.$gte = i.startDebit;
        }
        if (i.endDebit) {
          elemMatch.debit.$lte = i.endDebit;
        }
      }

      if (hasCredit) {
        elemMatch.credit = {};
        if (i.startCredit) {
          elemMatch.credit.$gte = i.startCredit;
        }
        if (i.endCredit) {
          elemMatch.credit.$lte = i.endCredit;
        }
      }

      return { $elemMatch: elemMatch };
    });

    return matchEntries;
  }

  private async validateEachEntry(entries: EntryDto[]) {
    // Forbid empty entry
    if (entries.length < 2) {
      throw new BadRequestException('Entries cannot be empty or single');
    }

    // Forbid multiple same account in an entry
    const seen = new Set();

    for (const entry of entries) {
      // Validate account id
      validateObjectId(entry.accountId);

      if (!(await this.accountModel.exists({ _id: entry.accountId }))) {
        throw new BadRequestException('Account id not found');
      }

      if (seen.has(entry.accountId)) {
        throw new BadRequestException(
          'An entry cannot have multiple same account at once!',
        );
      }
      seen.add(entry.accountId);

      // Forbid negative value of credit and debit
      if (entry.credit < 0 || entry.debit < 0) {
        throw new BadRequestException(
          "Debit and credit amounts can't be negative!",
        );
      }

      // Forbid debit and credit at once
      if (entry.debit > 0 && entry.credit > 0) {
        throw new BadRequestException(
          "An entry can't have both debit and credit",
        );
      }
    }
  }

  private getTotal(entries: EntryDto[], type: 'credit' | 'debit'): number {
    return entries.reduce((sum, entry) => sum + (entry[type] || 0), 0);
  }
}
