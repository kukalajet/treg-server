import { Injectable, NotFoundException } from '@nestjs/common';
import { GetProductsFilterDto } from './dto/get-products-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './listing.entity';
import { ProductRepository } from './listing.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductStatus } from './listing-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository
  ) {}

  public async getProducts(
    filterDto: GetProductsFilterDto,
    user: User
  ): Promise<Product[]> {
    return this.productRepository.getProducts(filterDto, user);
  }

  public async getProductById(
    id: number,
    user: User
  ): Promise<Product> {
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
    createProductDto: CreateProductDto,
    user: User
  ): Promise<Product> {
    return this.productRepository.createProduct(createProductDto, user);
  }

  public async updateProductStatus(
    id: number,
    status: ProductStatus,
    user: User
  ): Promise<Product> {
    const product = await this.getProductById(id, user);
    product.status = status;
    await product.save();

    return product;
  }
}