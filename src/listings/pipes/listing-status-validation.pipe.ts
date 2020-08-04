import { PipeTransform, BadRequestException } from "@nestjs/common";
import { ListingStatus } from "../listing-status.enum";

export class ListingStatusValidationPipe implements PipeTransform {
  
  readonly allowedStatuses = [
    ListingStatus.AVAILABLE,
    ListingStatus.SOLD
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