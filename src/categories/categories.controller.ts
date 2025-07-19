import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { SearchCategoryDto } from './dto/search-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private categoryService: CategoriesService) {}

  @Post()
  async create(@Body() body: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(body);
  }

  @Get()
  async search(@Query() query: SearchCategoryDto): Promise<Category[]> {
    const { name, codePrefix, isNormalBalanceDebit, limit, skip } = query;

    return this.categoryService.find({
      name,
      codePrefix,
      isNormalBalanceDebit,
      skip,
      limit,
    });
  }

  @Get('/:id')
  async findById(@Param('id') categoryId: string): Promise<Category | null> {
    return this.categoryService.findById(categoryId);
  }
}
