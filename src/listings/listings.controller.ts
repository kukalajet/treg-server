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
import { ProductsService } from './listings.service';
import { GetListingsFilterDto } from './dto/get-listings-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Listing } from './listing.entity';
import { CreateListingDto } from './dto/create-listing.dto';
import { ProductStatusValidationPipe } from './pipes/product-status-validation.pipe';
import { ListingStatus } from './listing-status.enum';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { ApiConsumes } from '@nestjs/swagger';
import { ApiMultiFile } from './decorators/api-multi-file.decorator';

@Controller('listings')
@UseGuards(AuthGuard())
export class ProductsController {

  private logger = new Logger('ProductsController');

  constructor(private productsService: ProductsService) {}

  @Get()
  public getProducts(
    @Query(ValidationPipe) filterDto: GetListingsFilterDto,
    @GetUser() user: User
  ) {
    this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`);
    return this.productsService.getProducts(filterDto, user);
  }

  @Get('/:id')
  public getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User
  ): Promise<Listing> {
    return this.productsService.getProductById(id, user);
  }

  @Delete('/:id')
  deleteProduct(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User
  ): Promise<void> {
    return this.productsService.deleteProduct(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @ApiConsumes('multipart/form-data')
  @ApiMultiFile()
  // @UseInterceptors(FilesInterceptor('files'))
  @UseInterceptors(FilesInterceptor('files[]'))
  public createProduct(
    @UploadedFiles() files: Express.Multer.File,
    @Body() createProductDto: CreateListingDto,
    @GetUser() user: User 
  ): Promise<Listing> {
    this.logger.verbose(`User "${user.username}" creating a new product. Data: ${JSON.stringify(createProductDto)}`);
    return this.productsService.createProduct(createProductDto, user);
  }

  @Patch('/:id/status')
  public updateProductStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', ProductStatusValidationPipe) status: ListingStatus,
    @GetUser() user: User
  ): Promise<Listing> {
    return this.productsService.updateProductStatus(id, status, user);
  }
}