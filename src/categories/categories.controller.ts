import { Body, Controller, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private categoryService: CategoriesService) {}

  @Post()
  async create(@Body() body: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(body);
  }
}
