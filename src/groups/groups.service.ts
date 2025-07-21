import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group, GroupDocument } from './schemas/group.schema';
import { FilterQuery, isValidObjectId, Model } from 'mongoose';
import { CreateGroupDto } from './dto/create-group.dto';
import { Category } from 'src/categories/schemas/category.schema';
import { SearchGroupDto } from './dto/search-group.dto';

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

  async find(searchGroupDto: SearchGroupDto = {}): Promise<Group[]> {
    const { name, categoryId } = searchGroupDto;

    const query: FilterQuery<GroupDocument> = {};

    if (name) query.name = { $regex: name, $options: 'i' };

    if (categoryId) {
      if (!isValidObjectId(categoryId))
        throw new BadRequestException('Invalid Category id');

      query.categoryId = categoryId;
    }

    return this.groupModel.find(query).populate('accounts').exec();
  }

  async findById(groupId: string): Promise<Group | null> {
    if (!isValidObjectId(groupId)) {
      throw new BadRequestException('Invalid Id');
    }

    const result = await this.groupModel.findById(groupId).exec();

    if (!result) {
      throw new NotFoundException('Group not found');
    }

    return result;
  }
}
