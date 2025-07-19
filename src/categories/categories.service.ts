import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';

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
}
