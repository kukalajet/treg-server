import { Repository, EntityRepository } from "typeorm";
import { Product } from "./listing.entity";
import { GetProductsFilterDto } from "./dto/get-products-filter.dto";
import { InternalServerErrorException, Logger } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductStatus } from "./listing-status.enum";
import { User } from "src/auth/user.entity";

@EntityRepository(Product)
export class ProductRepository extends Repository<Product> {
  
  private logger = new Logger('ProductRepository');

  public async getProducts(
    filterDto: GetProductsFilterDto,
    user: User
  ): Promise<Product[]> {
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
    createProductDto: CreateProductDto,
    user: User
  ): Promise<Product> {
    const { title, description } = createProductDto;

    const product = new Product();
    product.title = title;
    product.description = description;
    product.status = ProductStatus.AVAILABLE;
    product.user = user;

    try {
      await product.save();
    } catch (error) {
      this.logger.error(`Failed to create a product for user "${user.username}". Data: ${JSON.stringify(createProductDto)}`, error.stack);
      throw new InternalServerErrorException();
    }

    delete product.user;

    return product;
  }
}