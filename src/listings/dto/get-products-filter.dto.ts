import { IsOptional, IsIn, IsNotEmpty } from "class-validator";
import { ProductStatus } from "../listing-status.enum";

export class GetProductsFilterDto {

  @IsOptional()
  @IsIn([ProductStatus.AVAILABLE, ProductStatus.SOLD])
  status: ProductStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}