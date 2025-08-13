import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Transaction } from './schemas/transaction.schema';
import { Connection, isValidObjectId, Model } from 'mongoose';
import { Entry } from './schemas/entry.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Account } from 'src/accounts/schemas/account.schema';

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

      const newEntries: Entry[] = entries.map(
        (i) =>
          new this.entryModel({
            accountId: i.accountId,
            credit: i.credit,
            debit: i.debit,
          }),
      );

      const newTransaction = new this.transactionModel({
        name,
        date,
        description,
        entries: newEntries,
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

  async;

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

  async find(): Promise<Transaction[]> {}

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
