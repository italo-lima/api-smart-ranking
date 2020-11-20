import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICategory } from './interfaces/category.interface';
import { CreateCategoryDTO } from './dtos/createCategoryDTO';
import { UpdateCategoryDTO } from './dtos/updateCategoryDTO';
import { PlayersService } from 'src/players/players.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<ICategory>,
    private readonly playersService: PlayersService,
  ) {}

  async create(createCategoryDTO: CreateCategoryDTO): Promise<ICategory> {
    const { category } = createCategoryDTO;

    const checkCategory = await this.categoryModel.findOne({ category });

    if (checkCategory) {
      throw new BadRequestException(`Category ${category} already exists`);
    }

    const createCategory = new this.categoryModel(createCategoryDTO);

    return await createCategory.save();
  }

  async show(): Promise<Array<ICategory>> {
    return await this.categoryModel.find().populate('players');
  }

  async getCategoryOfPlayer(idPlayer: any): Promise<ICategory> {
    //await this.jogadoresService.consultarJogadorPeloId(idJogador)

    const players = await this.playersService.show();

    const playerFilter = players.filter(({ _id }) => _id == idPlayer);

    if (playerFilter.length == 0) {
      throw new BadRequestException(`O id ${idPlayer} não é um jogador!`);
    }

    return await this.categoryModel
      .findOne()
      .where('players')
      .in(idPlayer);
  }

  async index(category: string): Promise<ICategory> {
    const checkCategory = await this.categoryModel.findOne({ category });

    if (!checkCategory) {
      throw new NotFoundException(`Category ${category} not found`);
    }

    return checkCategory;
  }

  async update(
    category: string,
    updateCategoryDTO: UpdateCategoryDTO,
  ): Promise<void> {
    const checkCategory = await this.categoryModel.findOne({ category });

    if (!checkCategory) {
      throw new NotFoundException(`Category ${category} not found`);
    }

    await this.categoryModel.findByIdAndUpdate(
      { category },
      { $set: updateCategoryDTO },
    );
  }

  async addCategoryForPlayer(params: string[]): Promise<void> {
    const category = params['category'];
    const idPlayer = params['idPlayer'];

    await this.playersService.index(idPlayer);

    const checkCategory = await this.categoryModel.findOne({ category });

    if (!checkCategory) {
      throw new NotFoundException(`Category ${category} not found`);
    }

    const checkPlayerInCategory = await this.categoryModel
      .find({ category })
      .where('players')
      .in(idPlayer);

    if (checkPlayerInCategory.length > 0) {
      throw new BadRequestException(
        `Player ${idPlayer} registered in category ${category}`,
      );
    }

    checkCategory.players.push(idPlayer);

    await this.categoryModel.findOneAndUpdate(
      { category },
      { $set: checkCategory },
    );
  }
}
