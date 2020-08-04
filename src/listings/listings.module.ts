import { Module } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingRepository } from './listing.repository';
import { AuthModule } from 'src/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([ListingRepository]),
    MulterModule.register({ dest: '../uploads' }),
    AuthModule
  ],
  controllers: [ListingsController],
  providers: [ListingsService]
})
export class ListingsModule {}