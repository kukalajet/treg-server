import { Injectable, NotFoundException } from '@nestjs/common';
import { GetListingsFilterDto } from './dto/get-listings-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Listing } from './listing.entity';
import { ProductRepository } from './listing.repository';
import { CreateListingDto } from './dto/create-listing.dto';
import { ListingStatus } from './listing-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository
  ) {}

  public async getProducts(
    filterDto: GetListingsFilterDto,
    user: User
  ): Promise<Listing[]> {
    return this.productRepository.getProducts(filterDto, user);
  }

  public async getProductById(
    id: number,
    user: User
  ): Promise<Listing> {
    const found = await this.productRepository.findOne({ where: { id, userId: user.id } });
    if (!found) throw new NotFoundException(`Task with ID "${id}" not found`);

    return found;
  }

  public async deleteProduct(
    id: number,
    user: User
  ): Promise<void> {
    const result = await this.productRepository.delete({ id, userId: user.id });
    if (result.affected === 0) throw new NotFoundException(`Task with ID "${id}" not found`);
  }

  public async createProduct(
    createProductDto: CreateListingDto,
    user: User
  ): Promise<Listing> {
    return this.productRepository.createProduct(createProductDto, user);
  }

  public async updateProductStatus(
    id: number,
    status: ListingStatus,
    user: User
  ): Promise<Listing> {
    const product = await this.getProductById(id, user);
    product.status = status;
    await product.save();

    return product;
  }
}