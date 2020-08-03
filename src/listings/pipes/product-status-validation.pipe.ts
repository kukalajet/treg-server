import { PipeTransform, BadRequestException } from "@nestjs/common";
import { ProductStatus } from "../listing-status.enum";

export class ProductStatusValidationPipe implements PipeTransform {
  
  readonly allowedStatuses = [
    ProductStatus.AVAILABLE,
    ProductStatus.SOLD
  ];

  transform(value: any) {
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} is an invalid status`);
    }

    return value;
  }

  private isStatusValid(status: any) {
    const index = this.allowedStatuses.indexOf(status);
    return index !== -1;
  }
}