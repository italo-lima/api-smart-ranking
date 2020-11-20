import {
  Controller,
  Body,
  Post,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  Put,
} from '@nestjs/common';
import { CreateCategoryDTO } from './dtos/createCategoryDTO';
import { ICategory } from './interfaces/category.interface';
import { CategoriesService } from './categories.service';
import { UpdateCategoryDTO } from './dtos/updateCategoryDTO';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(
    @Body() createCategoryDTO: CreateCategoryDTO,
  ): Promise<ICategory> {
    return await this.categoriesService.create(createCategoryDTO);
  }

  @Get()
  async getCategories(): Promise<Array<ICategory>> {
    return await this.categoriesService.show();
  }

  @Get(':category')
  async getByCategoryId(
    @Param('category') category: string,
  ): Promise<ICategory> {
    return await this.categoriesService.index(category);
  }

  @Put(':category')
  @UsePipes(ValidationPipe)
  async updateCategory(
    @Body() updateCategoryDTO: UpdateCategoryDTO,
    @Param('category') category: string,
  ): Promise<void> {
    await this.categoriesService.update(category, updateCategoryDTO);
  }

  @Post('/:category/player/:idPlayer')
  async addCategoryForPlayer(@Param() params: string[]): Promise<void> {
    return await this.categoriesService.addCategoryForPlayer(params);
  }
}
