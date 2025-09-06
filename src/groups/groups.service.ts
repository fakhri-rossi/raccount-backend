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
import { UpdateGroupDto } from './dto/update-group.dto';
import { validateObjectId } from 'src/common/utils/id.util';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<Group>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const { name, categoryId, description } = createGroupDto;

    validateObjectId(categoryId);

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
      validateObjectId(categoryId);

      query.categoryId = categoryId;
    }

    return this.groupModel.find(query).populate('accounts').exec();
  }

  async findById(groupId: string): Promise<Group | null> {
    validateObjectId(groupId);

    const result = await this.groupModel.findById(groupId).exec();

    if (!result) {
      throw new NotFoundException('Group not found');
    }

    return result;
  }

  async updateOne(groupId: string, dto: UpdateGroupDto): Promise<Group | null> {
    validateObjectId(groupId);

    const { name, categoryId } = dto;

    if (!(await this.groupModel.exists({ _id: groupId }))) {
      throw new NotFoundException('Group not found');
    }

    if (categoryId && !(await this.categoryModel.exists({ _id: categoryId }))) {
      throw new NotFoundException('Category not found');
    }

    if (
      name &&
      !(await this.groupModel.exists({ name, id: { $ne: groupId } }))
    ) {
      throw new ConflictException('Name is already used');
    }

    return await this.groupModel
      .findByIdAndUpdate(groupId, { ...dto }, { new: true })
      .exec();
  }

  async deleteOne(groupId: string): Promise<Group | null> {
    validateObjectId(groupId);

    const group = await this.groupModel.findById(groupId).exec();

    if (!group) {
      throw new NotFoundException('Group id not found');
    }

    if (group.accounts[0]) {
      throw new ConflictException(
        "Can't delete group: The group contains account",
      );
    }

    return await this.groupModel.findByIdAndDelete(groupId).exec();
  }
}
