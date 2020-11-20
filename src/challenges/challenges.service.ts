import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IChallenge, IGame } from './interfaces/challenge.interface';
import { Model } from 'mongoose';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { PlayersService } from 'src/players/players.service';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';
import { AssignMatchChallengeDto } from './dtos/assign-match-challenge.dto';
import { ChallengeStatus } from './interfaces/challenge-status';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class ChallengesService {
  constructor(
    @InjectModel('Challenge')
    private readonly challengeModel: Model<IChallenge>,
    @InjectModel('Game') private readonly gameModel: Model<IGame>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  private readonly logger = new Logger(ChallengesService.name);

  async create(createChallengeDto: CreateChallengeDto): Promise<IChallenge> {
    const players = await this.playersService.show();

    createChallengeDto.players.map(({ _id }) => {
      const playersFilter = players.filter(player => player._id == _id);

      if (playersFilter.length == 0) {
        throw new BadRequestException(`The ${_id} is not player!`);
      }
    });

    const requesterIsPlayerOfGame = await createChallengeDto.players.filter(
      player => player._id == createChallengeDto.requester,
    );

    if (requesterIsPlayerOfGame.length == 0) {
      throw new BadRequestException(
        `O solicitante deve ser um jogador da partida!`,
      );
    }

    const categoryOfPlayer = await this.categoriesService.getCategoryOfPlayer(
      createChallengeDto.requester,
    );

    if (!categoryOfPlayer) {
      throw new BadRequestException(
        `O solicitante precisa estar registrado em uma categoria!`,
      );
    }

    const challengeCreate = new this.challengeModel(createChallengeDto);
    challengeCreate.category = categoryOfPlayer.category;
    challengeCreate.dateHourRequester = new Date();

    challengeCreate.status = ChallengeStatus.PENDENTE;
    return await challengeCreate.save();
  }

  async show(): Promise<Array<IChallenge>> {
    return await this.challengeModel
      .find()
      .populate('requester')
      .populate('players')
      .populate('game');
  }

  async getChallengeOfPlayer(_id: any): Promise<Array<IChallenge>> {
    const players = await this.playersService.show();

    const playerFilter = players.filter(player => player._id == _id);

    if (playerFilter.length == 0) {
      throw new BadRequestException(`O id ${_id} não é um jogador!`);
    }

    return await this.challengeModel
      .find()
      .where('players')
      .in(_id)
      .populate('requester')
      .populate('players')
      .populate('game');
  }

  async updateChallenge(
    _id: string,
    updateChallengeDto: UpdateChallengeDto,
  ): Promise<void> {
    const challengeFind = await this.challengeModel.findById(_id);

    if (!challengeFind) {
      throw new NotFoundException(`Desafio ${_id} não cadastrado!`);
    }

    if (updateChallengeDto.status) {
      challengeFind.dateHourResponse = new Date();
    }
    challengeFind.status = updateChallengeDto.status;
    challengeFind.dateHourChallenge = updateChallengeDto.dateHourChallenge;

    await this.challengeModel.findOneAndUpdate(
      { _id },
      { $set: challengeFind },
    );
  }

  async assignMatchChallenge(
    _id: string,
    assignMatchChallengeDto: AssignMatchChallengeDto,
  ): Promise<void> {
    const challengeFind = await this.challengeModel.findById(_id);

    if (!challengeFind) {
      throw new BadRequestException(`Desafio ${_id} não cadastrado!`);
    }

    const playerFilter = challengeFind.players.filter(
      player => player._id == assignMatchChallengeDto.def,
    );

    this.logger.log(`challengeFind: ${challengeFind}`);
    this.logger.log(`playerFilter: ${playerFilter}`);

    if (playerFilter.length == 0) {
      throw new BadRequestException(
        `O jogador vencedor não faz parte do desafio!`,
      );
    }

    const createGame = new this.gameModel(assignMatchChallengeDto);

    createGame.category = challengeFind.category;

    createGame.players = challengeFind.players;

    const result = await createGame.save();

    challengeFind.status = ChallengeStatus.REALIZADO;

    challengeFind.game = result._id;

    try {
      await this.challengeModel.findOneAndUpdate(
        { _id },
        { $set: challengeFind },
      );
    } catch (error) {
      await this.challengeModel.deleteOne({ _id: result._id });
      throw new InternalServerErrorException();
    }
  }

  async destroy(_id: string): Promise<void> {
    const challengeFind = await this.challengeModel.findById(_id);

    if (!challengeFind) {
      throw new BadRequestException(`Desafio ${_id} não cadastrado!`);
    }

    challengeFind.status = ChallengeStatus.CANCELADO;

    await this.challengeModel.findOneAndUpdate(
      { _id },
      { $set: challengeFind },
    );
  }
}
