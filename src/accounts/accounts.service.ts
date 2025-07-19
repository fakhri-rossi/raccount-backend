import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Account } from './schemas/account.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<Account>,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const { name, code } = createAccountDto;

    if (
      await this.accountModel.findOne({
        $or: [{ name }, { code }],
      })
    ) {
      throw new ConflictException('Name or Code of account must be unique');
    }

    let accountLevel: number;

    if (!createAccountDto.parentId) {
      accountLevel = 1;
    } else {
      const parentAccount = await this.accountModel.findById(
        createAccountDto.parentId,
      );

      if (!parentAccount)
        throw new NotFoundException("Parent account doesn't exist");
      accountLevel = parentAccount.level;
    }

    const createdAccount = new this.accountModel({
      ...createAccountDto,
      level: accountLevel,
      isActive: true,
    });
    return createdAccount.save();
  }
}
