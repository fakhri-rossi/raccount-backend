import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { DeleteResult, FilterQuery, isValidObjectId, Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category';
import { validateObjectId } from 'src/common/utils/id.util';
import { Account } from 'src/accounts/schemas/account.schema';
import { Group } from 'src/groups/schemas/group.schema';

export interface FindCategoryOptions {
  name?: string;
  codePrefix?: number;
  isNormalBalanceDebit?: boolean;
  skip?: number;
  limit?: number;
}

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Account.name) private accountModel: Model<Account>,
    @InjectModel(Group.name) private groupModel: Model<Group>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name, isNormalBalanceDebit, codePrefix } = createCategoryDto;

    if (await this.categoryModel.exists({ $or: [{ name }, { codePrefix }] })) {
      throw new ConflictException('Name or code prefix already registered');
    }

    if (codePrefix <= 0 || codePrefix > 9) {
      throw new ConflictException('Code Prefix must be a digit of 1 - 9');
    }

    const createdCategory = new this.categoryModel({
      name,
      codePrefix,
      isNormalBalanceDebit,
    });

    return createdCategory.save();
  }

  async find(options: FindCategoryOptions = {}): Promise<Category[]> {
    const {
      name,
      codePrefix,
      isNormalBalanceDebit,
      limit = 9,
      skip = 0,
    } = options;

    const filter: FilterQuery<CategoryDocument> = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }

    if (codePrefix) {
      filter.codePrefix = codePrefix;
    }

    if (isNormalBalanceDebit) {
      filter.isNormalBalanceDebit = isNormalBalanceDebit;
    }

    return await this.categoryModel.find(filter).skip(skip).limit(limit).exec();
  }

  async findById(categoryId: string): Promise<Category | null> {
    validateObjectId(categoryId);

    const result = await this.categoryModel.findById(categoryId).exec();

    if (!result) {
      throw new NotFoundException('Category not found');
    }

    return result;
  }

  async updateOne(
    categoryId: string,
    dto: UpdateCategoryDto,
  ): Promise<Category | null> {
    validateObjectId(categoryId);

    const { name, codePrefix, isNormalBalanceDebit } = dto;
    const oldCategory = await this.categoryModel
      .findById(categoryId)
      .lean()
      .exec();

    if (!oldCategory) {
      throw new NotFoundException('Category is not found');
    }

    if (
      name &&
      (await this.categoryModel
        .findOne({ name, id: { $ne: categoryId } })
        .exec())
    ) {
      throw new ConflictException('Name is already used');
    }

    if (
      codePrefix &&
      (await this.categoryModel.findOne({ codePrefix }).exec())
    ) {
      throw new ConflictException('Code Prefix is already used');
    }

    const res = await this.categoryModel
      .findByIdAndUpdate(
        categoryId,
        { name, codePrefix, isNormalBalanceDebit },
        { new: true },
      )
      .exec();

    return res;
  }

  async delete(categoryId: string): Promise<Category | null> {
    validateObjectId(categoryId);

    if (!(await this.categoryModel.exists({ _id: categoryId }))) {
      throw new NotFoundException('Category id not found');
    }

    if (await this.groupModel.exists({ categoryId })) {
      throw new ConflictException("Can't delete: Category contains group");
    }

    if (await this.accountModel.exists({ categoryId })) {
      throw new ConflictException("Can't delete: Category contains account");
    }

    return await this.categoryModel.findByIdAndDelete(categoryId).exec();
  }
}
