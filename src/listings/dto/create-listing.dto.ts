import { IsNotEmpty } from 'class-validator';

export class CreateListingDto {

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  quantity: number;
}