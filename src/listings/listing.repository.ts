import { Repository, EntityRepository } from "typeorm";
import { Listing } from "./listing.entity";
import { GetListingsFilterDto } from "./dto/get-listings-filter.dto";
import { InternalServerErrorException, Logger } from "@nestjs/common";
import { CreateListingDto } from "./dto/create-listing.dto";
import { ListingStatus } from "./listing-status.enum";
import { User } from "src/auth/user.entity";

@EntityRepository(Listing)
export class ProductRepository extends Repository<Listing> {
  
  private logger = new Logger('ProductRepository');

  public async getProducts(
    filterDto: GetListingsFilterDto,
    user: User
  ): Promise<Listing[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('product');

    query.where('product.userId = :userId', { userId: user.id });
    if (status) query.andWhere('product.status = :status', { status });
    if (search) query.andWhere('(product.title LIKE :search OR product.description LIKE :search)', { search: `%${search}$%`});

    try {
      const products = await query.getMany();
      return products;
    } catch (error) {
      this.logger.error(`Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(filterDto)}`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  public async createProduct(
    createListingDto: CreateListingDto,
    user: User
  ): Promise<Listing> {
    const { title, description, price, quantity } = createListingDto;

    const product = new Listing();
    product.title = title;
    product.description = description;
    product.price = price;
    product.quantity = quantity;
    product.status = ListingStatus.AVAILABLE;
    product.user = user;

    try {
      await product.save();
    } catch (error) {
      this.logger.error(`Failed to create a product for user "${user.username}". Data: ${JSON.stringify(createListingDto)}`, error.stack);
      throw new InternalServerErrorException();
    }

    delete product.user;

    return product;
  }
}