import { 
  Controller, 
  Logger, 
  Get, 
  Query, 
  ValidationPipe, 
  UseGuards, 
  Param, 
  ParseIntPipe, 
  Post, 
  UsePipes, 
  Body, 
  Patch, 
  Delete, 
  UseInterceptors, 
  UploadedFiles
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { GetListingsFilterDto } from './dto/get-listings-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Listing } from './listing.entity';
import { CreateListingDto } from './dto/create-listing.dto';
import { ListingStatusValidationPipe } from './pipes/listing-status-validation.pipe';
import { ListingStatus } from './listing-status.enum';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { ApiConsumes } from '@nestjs/swagger';
import { ApiMultiFile } from './decorators/api-multi-file.decorator';

@Controller('listings')
@UseGuards(AuthGuard())
export class ListingsController {

  private logger = new Logger('ListingsController');

  constructor(private listingsService: ListingsService) {}

  @Get()
  public getListings(
    @Query(ValidationPipe) filterDto: GetListingsFilterDto,
    @GetUser() user: User
  ) {
    this.logger.verbose(`User "${user.name}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`);
    return this.listingsService.getListings(filterDto, user);
  }

  @Get('/:id')
  public getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User
  ): Promise<Listing> {
    return this.listingsService.getListingById(id, user);
  }

  @Delete('/:id')
  deleteListing(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User
  ): Promise<void> {
    return this.listingsService.deleteListing(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @ApiConsumes('multipart/form-data')
  @ApiMultiFile()
  // @UseInterceptors(FilesInterceptor('files'))
  @UseInterceptors(FilesInterceptor('files[]'))
  public createListing(
    @UploadedFiles() files: Express.Multer.File,
    @Body() createListingDto: CreateListingDto,
    @GetUser() user: User 
  ): Promise<Listing> {
    this.logger.verbose(`User "${user.name}" creating a new listing. Data: ${JSON.stringify(createListingDto)}`);
    return this.listingsService.createListing(createListingDto, user);
  }

  @Patch('/:id/status')
  public updateListingStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', ListingStatusValidationPipe) status: ListingStatus,
    @GetUser() user: User
  ): Promise<Listing> {
    return this.listingsService.updateListingStatus(id, status, user);
  }
}