import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Body,
  Get,
  Query,
  Put,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { IChallenge } from './interfaces/challenge.interface';
import { ChallengeStatusValidacaoPipe } from './pipes/challenge-status-validation';
import { AssignMatchChallengeDto } from './dtos/assign-match-challenge.dto';
import { UpdateChallengeDto } from './dtos/update-challenge.dto';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  private readonly logger = new Logger(ChallengesController.name);

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(
    @Body() createChallengeDto: CreateChallengeDto,
  ): Promise<IChallenge> {
    this.logger.log(`criarDesafioDto: ${JSON.stringify(createChallengeDto)}`);
    return await this.challengesService.create(createChallengeDto);
  }

  @Get()
  async getChallenge(
    @Query('idPlayer') _id: string,
  ): Promise<Array<IChallenge>> {
    return _id
      ? await this.challengesService.getChallengeOfPlayer(_id)
      : await this.challengesService.show();
  }

  @Put('/:challenge')
  async updateChallenge(
    @Body(ChallengeStatusValidacaoPipe) updateChallengeDto: UpdateChallengeDto,
    @Param('challenge') _id: string,
  ): Promise<void> {
    await this.challengesService.updateChallenge(_id, updateChallengeDto);
  }

  @Post('/:challenge/game')
  async assignMatchChallenge(
    @Body(ValidationPipe) assignMatchChallengeDto: AssignMatchChallengeDto,
    @Param('challenge') _id: string,
  ): Promise<void> {
    return await this.challengesService.assignMatchChallenge(
      _id,
      assignMatchChallengeDto,
    );
  }

  @Delete('/:_id')
  async deleteChallenge(@Param('_id') _id: string): Promise<void> {
    await this.challengesService.destroy(_id);
  }
}
