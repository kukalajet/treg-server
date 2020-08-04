import { Injectable, NotFoundException } from '@nestjs/common';
import { GetListingsFilterDto } from './dto/get-listings-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Listing } from './listing.entity';
import { ListingRepository } from './listing.repository';
import { CreateListingDto } from './dto/create-listing.dto';
import { ListingStatus } from './listing-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class ListingsService {

  constructor(
    @InjectRepository(ListingRepository)
    private listingRepository: ListingRepository
  ) {}

  public async getListings(
    filterDto: GetListingsFilterDto,
    user: User
  ): Promise<Listing[]> {
    return this.listingRepository.getListings(filterDto, user);
  }

  public async getListingById(
    id: number,
    user: User
  ): Promise<Listing> {
    const found = await this.listingRepository.findOne({ where: { id, userId: user.id } });
    if (!found) throw new NotFoundException(`Task with ID "${id}" not found`);

    return found;
  }

  public async deleteListing(
    id: number,
    user: User
  ): Promise<void> {
    const result = await this.listingRepository.delete({ id, userId: user.id });
    if (result.affected === 0) throw new NotFoundException(`Task with ID "${id}" not found`);
  }

  public async createListing(
    createListingDto: CreateListingDto,
    user: User
  ): Promise<Listing> {
    return this.listingRepository.createListing(createListingDto, user);
  }

  public async updateListingStatus(
    id: number,
    status: ListingStatus,
    user: User
  ): Promise<Listing> {
    const listing = await this.getListingById(id, user);
    listing.status = status;
    await listing.save();

    return listing;
  }
}