import { Repository, EntityRepository } from "typeorm";
import { Listing } from "./listing.entity";
import { GetListingsFilterDto } from "./dto/get-listings-filter.dto";
import { InternalServerErrorException, Logger } from "@nestjs/common";
import { CreateListingDto } from "./dto/create-listing.dto";
import { ListingStatus } from "./listing-status.enum";
import { User } from "src/auth/user.entity";

@EntityRepository(Listing)
export class ListingRepository extends Repository<Listing> {
  
  private logger = new Logger('ListingRepository');

  public async getListings(
    filterDto: GetListingsFilterDto,
    user: User
  ): Promise<Listing[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('listing');

    query.where('listing.userId = :userId', { userId: user.id });
    if (status) query.andWhere('listing.status = :status', { status });
    if (search) query.andWhere('(listing.title LIKE :search OR listing.description LIKE :search)', { search: `%${search}$%`});

    try {
      const listings = await query.getMany();
      return listings;
    } catch (error) {
      this.logger.error(`Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(filterDto)}`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  public async createListing(
    createListingDto: CreateListingDto,
    user: User
  ): Promise<Listing> {
    const { title, description, price, quantity } = createListingDto;

    const listing = new Listing();
    listing.title = title;
    listing.description = description;
    listing.price = price;
    listing.quantity = quantity;
    listing.status = ListingStatus.AVAILABLE;
    listing.user = user;

    try {
      await listing.save();
    } catch (error) {
      this.logger.error(`Failed to create a listing for user "${user.username}". Data: ${JSON.stringify(createListingDto)}`, error.stack);
      throw new InternalServerErrorException();
    }

    delete listing.user;

    return listing;
  }
}