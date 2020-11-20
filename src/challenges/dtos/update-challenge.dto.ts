import { ChallengeStatus } from '../interfaces/challenge-status';
import { IsOptional } from 'class-validator';

export class UpdateChallengeDto {
  @IsOptional()
  dateHourChallenge: Date;

  @IsOptional()
  status: ChallengeStatus;
}
