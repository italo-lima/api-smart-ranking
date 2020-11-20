import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  UsePipes,
  ValidationPipe,
  Put,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDTO } from './dtos/create-player.dto';
import { IPlayer } from './interfaces/player.interface';
import { ValidationParamsPipe } from '../common/pipes/validation.pipe';
import { UpdatePlayerDTO } from './dtos/update-player.dto';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(
    @Body() createPlayerDTO: CreatePlayerDTO,
  ): Promise<IPlayer> {
    return await this.playersService.createPlayer(createPlayerDTO);
  }

  @Put(':_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Body() updatePlayerDTO: UpdatePlayerDTO,
    @Param('_id', ValidationParamsPipe) _id: string,
  ): Promise<void> {
    await this.playersService.updatePlayer(_id, updatePlayerDTO);
  }

  @Get()
  async allPlayers(): Promise<IPlayer[]> {
    return await this.playersService.show();
  }

  @Get(':_id')
  async getPlayerById(
    @Param('_id', ValidationParamsPipe) _id: string,
  ): Promise<IPlayer> {
    return await this.playersService.index(_id);
  }

  @Delete(':_id')
  async destroyPlayer(
    @Param('_id', ValidationParamsPipe) _id: string,
  ): Promise<void> {
    return await this.playersService.destroy(_id);
  }
}
