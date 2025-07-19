import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { FilterQuery, isValidObjectId, Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';

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
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name, isNormalBalanceDebit, codePrefix } = createCategoryDto;

    if (
      await this.categoryModel.findOne({
        $or: [{ name }, { codePrefix }],
      })
    )
      throw new ConflictException('Name AND code prefix must be unique');

    if (codePrefix <= 0 || codePrefix > 9)
      throw new ConflictException('Code Prefix must be a digit of 1 - 9');

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

    if (name) filter.name = { $regex: name, $options: 'i' };

    if (codePrefix) filter.codePrefix = codePrefix;

    if (isNormalBalanceDebit)
      filter.isNormalBalanceDebit = isNormalBalanceDebit;

    return await this.categoryModel.find(filter).skip(skip).limit(limit).exec();
  }

  async findById(categoryId: string): Promise<Category | null> {
    if (!isValidObjectId(categoryId)) {
      throw new BadRequestException('Invalid id format');
    }

    const result = await this.categoryModel.findById(categoryId).exec();

    if (!result) {
      throw new NotFoundException('Category not found');
    }
    return result;
  }
}
