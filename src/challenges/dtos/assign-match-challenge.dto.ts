import { IsNotEmpty } from 'class-validator';
import { IChallenge } from '../interfaces/challenge.interface';
import { IPlayer } from '../../players/interfaces/player.interface';

export class AssignMatchChallengeDto {
  @IsNotEmpty()
  def: IPlayer;

  @IsNotEmpty()
  result: Array<IChallenge>;
}
