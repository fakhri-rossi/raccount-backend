import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Account, AccountDocument } from './schemas/account.schema';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountType } from 'src/common/enums/accountType.enum';

export interface FindAccountOptions {
  code?: string;
  type?: AccountType;
  parentId?: string;
  level?: number;
  name?: string;
  skip?: number;
  limit?: number;
}

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

  async find(options: FindAccountOptions = {}): Promise<Account[]> {
    const { code, level, name, parentId, type, skip = 0, limit = 20 } = options;

    const filter: FilterQuery<AccountDocument> = {};

    if (name) filter.name = { $regex: name, $options: 'i' };

    if (code) filter.code = code;

    if (level) filter.level = level;

    if (parentId) filter.parentId = parentId;

    if (type) filter.type = type;

    return await this.accountModel.find(filter).skip(skip).limit(limit);
  }

  async findById(id: string): Promise<Account | null> {
    return this.accountModel.findById(id);
  }
}
