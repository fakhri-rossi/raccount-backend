import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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
    const session = await this.connection.startSession();

    session.startTransaction();

    this.validateEntryStructure(entries);

    try {
      this.validateEntryStructure(entries);
      await this.validateEntriesAsync(entries, session);

      // Validate the balance of amount of debits and credits, they have to be the same!
      // debit === credit
      const debitTotal = this.getTotal(entries, 'debit');
      const creditTotal = this.getTotal(entries, 'credit');

      if (debitTotal !== creditTotal) {
        throw new BadRequestException(
          `Debit and credit are not balance!\nDebit Total: ${debitTotal}\nCredit Total: ${creditTotal}`,
        );
      }

      const newEntries: Entry[] = entries.map((i) => ({
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

      const createdTransaction = await newTransaction.save({ session });
      await session.commitTransaction();
      return createdTransaction;
    } catch (error) {
      console.log('Transaction creation failed: ', error);
      await session.abortTransaction();
      throw new InternalServerErrorException(error.message);
    } finally {
      session.endSession();
    }
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

  private validateEntryStructure(entries: Entry[]) {
    // Forbid empty entry
    if (entries.length < 2) {
      throw new BadRequestException('Entries cannot be empty or single');
    }

    // Forbid multiple same account in an entry
    const seen = new Set();
    for (const entry of entries) {
      if (seen.has(entry.accountId)) {
        throw new BadRequestException(
          'An entry cannot have multiple same account at once!',
        );
      }
      seen.add(entry.accountId);
    }
  }

  private async validateEntriesAsync(
    entries: Entry[],
    session: any,
  ): Promise<void> {
    for (const item of entries) {
      // Forbid negative value of creadit and debit
      if (item.credit < 0 || item.debit < 0) {
        throw new BadRequestException(
          "Debit and credit amounts can't be negative!",
        );
      }

      // Forbid debit and credit at once
      if (item.debit > 0 && item.credit > 0) {
        throw new BadRequestException(
          "An entry can't have both debit and credit",
        );
      }

      // Forbid Invalid account id
      if (
        !isValidObjectId(item.accountId) ||
        !(await this.accountModel
          .findById(item.accountId)
          .session(session)
          .exec())
      ) {
        throw new BadRequestException('Invalid Id or non-existent account id');
      }
    }
  }

  private getTotal(entries: Entry[], type: 'credit' | 'debit'): number {
    return entries.reduce((sum, entry) => sum + (entry[type] || 0), 0);
  }
}
