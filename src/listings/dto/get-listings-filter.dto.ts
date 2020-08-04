import { IsOptional, IsIn, IsNotEmpty } from "class-validator";
import { ListingStatus } from "../listing-status.enum";

export class GetListingsFilterDto {

  @IsOptional()
  @IsIn([ListingStatus.AVAILABLE, ListingStatus.SOLD])
  status: ListingStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}