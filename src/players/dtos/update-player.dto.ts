import { IsNotEmpty } from 'class-validator';

export class UpdatePlayerDTO {
  @IsNotEmpty()
  readonly phone: string;

  @IsNotEmpty()
  readonly name: string;
}
