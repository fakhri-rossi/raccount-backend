import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Account, AccountDocument } from './schemas/account.schema';
import { FilterQuery, isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAccountDto } from './dto/create-account.dto';
import { Category } from 'src/categories/schemas/category.schema';
import { Group } from 'src/groups/schemas/group.schema';
import { SearchAccountDto } from './dto/search-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { validateObjectId } from 'src/common/utils/id.util';
import { Transaction } from 'src/transactions/schemas/transaction.schema';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<Account>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Group.name) private groupModel: Model<Group>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const { name, code, categoryId, groupId } = createAccountDto;

    if (
      await this.accountModel.findOne({
        $or: [{ name }, { code }],
      })
    ) {
      throw new ConflictException(
        'Name or Code of account already registered, choose another one',
      );
    }

    if (!isValidObjectId(categoryId)) {
      throw new BadRequestException('Invalid category id');
    }

    const category = await this.categoryModel.findById(categoryId).exec();

    if (!category) {
      throw new NotFoundException('Category is not found!');
    }

    if (groupId) {
      if (!isValidObjectId(groupId)) {
        throw new BadRequestException('Invalid category id');
      }

      if (!(await this.groupModel.findById(groupId).exec())) {
        throw new NotFoundException('Group is not found');
      }
    }

    if (createAccountDto.code.toString()[0] != category.codePrefix.toString()) {
      throw new BadRequestException(
        'Account code prefix has to be the same with its category code prefix',
      );
    }

    const createdAccount = new this.accountModel({
      ...createAccountDto,
      isActive: true,
    });
    return createdAccount.save();
  }

  async find(options: SearchAccountDto = {}): Promise<Account[]> {
    const { code, name, categoryId, groupId, skip = 0, limit = 20 } = options;

    const filter: FilterQuery<AccountDocument> = {};

    if (name) filter.name = { $regex: name, $options: 'i' };

    if (code) filter.code = code;

    if (categoryId) {
      if (!isValidObjectId(categoryId)) {
        throw new BadRequestException('Invalid category id');
      }
      filter.categoryId = categoryId;
    }

    if (groupId) {
      if (!isValidObjectId(groupId)) {
        throw new BadRequestException('Invalid group id');
      }
      filter.groupId = groupId;
    }

    return await this.accountModel.find(filter).skip(skip).limit(limit).exec();
  }

  async findById(id: string): Promise<Account | null> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid id');
    }

    const result = await this.accountModel.findById(id).exec();

    if (!result) {
      throw new NotFoundException('Account is not found');
    }

    return result;
  }

  async updateOne(
    accountId: string,
    dto: UpdateAccountDto,
  ): Promise<Account | null> {
    const { categoryId, code, groupId, name } = dto;

    validateObjectId(accountId);

    if (!(await this.accountModel.exists({ _id: accountId }))) {
      throw new NotFoundException('Account id not found');
    }

    if (categoryId && !(await this.categoryModel.exists({ _id: categoryId }))) {
      throw new NotFoundException('Category id not found');
    }

    if (groupId && !(await this.groupModel.exists({ _id: groupId }))) {
      throw new NotFoundException('Group id not found');
    }

    // Prevent duplicate name
    if (
      name &&
      (await this.accountModel.exists({ name, _id: { $ne: accountId } }))
    ) {
      throw new ConflictException('Name is already used, choose another one!');
    }

    // Prevent duplicate code
    if (
      code &&
      (await this.accountModel.exists({ code, _id: { $ne: accountId } }))
    ) {
      throw new ConflictException('Code is already used, choose another one!');
    }

    return await this.accountModel
      .findByIdAndUpdate(accountId, { ...dto }, { new: true })
      .exec();
  }

  async deleteOne(accountId: string): Promise<Account | null> {
    validateObjectId(accountId);

    if (!(await this.accountModel.exists({ _id: accountId }))) {
      throw new NotFoundException('Account ID not found');
    }

    if (
      await this.transactionModel.exists({
        entries: { $elemMatch: { _id: accountId } },
      })
    ) {
      throw new ConflictException(
        "Can't delete: Account ever used in transaction. You can deactivate the account instead.",
      );
    }

    return await this.accountModel.findByIdAndDelete(accountId).exec();
  }
}
