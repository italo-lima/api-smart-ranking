import { IsOptional, IsString, IsArray, ArrayMinSize } from 'class-validator';
import { IEvent } from '../interfaces/category.interface';

export class UpdateCategoryDTO {
  @IsString()
  @IsOptional()
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  events: Array<IEvent>;
}
