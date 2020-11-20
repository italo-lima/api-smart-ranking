import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { IPlayer } from './interfaces/player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdatePlayerDTO } from './dtos/update-player.dto';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player')
    private readonly playerModel: Model<IPlayer>,
  ) {}

  async createPlayer(createPlayerDTO: CreatePlayerDTO): Promise<IPlayer> {
    const { email } = createPlayerDTO;

    const checkPlayer = await this.playerModel.findOne({ email });

    if (checkPlayer) {
      throw new BadRequestException(
        `Player with email ${email} already exists`,
      );
    }

    const player = new this.playerModel(createPlayerDTO);

    await player.save();

    return player;
  }

  async updatePlayer(
    _id: string,
    updatePlayerDTO: UpdatePlayerDTO,
  ): Promise<void> {
    const checkPlayer = await this.playerModel.findOne({ _id });

    if (!checkPlayer) {
      throw new NotFoundException(`Player with id ${_id} not found`);
    }

    await this.playerModel.findByIdAndUpdate(
      { _id },
      { $set: updatePlayerDTO },
    );
  }

  async show(): Promise<IPlayer[]> {
    return await this.playerModel.find();
  }

  async index(_id: string): Promise<IPlayer> {
    const player = await this.playerModel.findOne({ _id });

    if (!player) {
      throw new NotFoundException(`Player not found by id ${_id}`);
    }

    return player;
  }

  async destroy(_id: string): Promise<void> {
    const checkPlayer = await this.playerModel.findOne({ _id });

    if (!checkPlayer) {
      throw new NotFoundException(`Player with id ${_id} not found`);
    }

    await this.playerModel.findOneAndDelete({ _id });
  }
}
