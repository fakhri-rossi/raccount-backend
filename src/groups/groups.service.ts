import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from './schemas/group.schema';
import { isValidObjectId, Model } from 'mongoose';
import { CreateGroupDto } from './dto/create-group.dto';
import { Category } from 'src/categories/schemas/category.schema';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<Group>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const { name, categoryId, description } = createGroupDto;

    if (!isValidObjectId(categoryId)) {
      throw new BadRequestException('Invalid Id');
    }

    if (await this.groupModel.findOne({ name }).exec()) {
      throw new ConflictException(
        'Group name is already registered, choose another one!',
      );
    }

    if (!(await this.categoryModel.findById(categoryId).exec())) {
      throw new NotFoundException('Category is not found');
    }

    const createdGroup = new this.groupModel({
      name,
      categoryId,
      description,
      accounts: [],
    });

    return createdGroup.save();
  }
}
