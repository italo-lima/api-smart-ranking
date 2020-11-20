import { Document } from 'mongoose';

import { IPlayer } from 'src/players/interfaces/player.interface';
import { ChallengeStatus } from './challenge-status';

export interface IChallenge extends Document {
  dateHourChallenge: Date;
  status: ChallengeStatus;
  dateHourRequester: Date;
  dateHourResponse: Date;
  requester: IPlayer;
  category: string;
  players: Array<IPlayer>;
  game: IGame;
}

export interface IGame extends Document {
  category: string;
  players: Array<IPlayer>;
  def: IPlayer;
  result: Array<Result>;
}

export interface Result {
  set: string;
}
