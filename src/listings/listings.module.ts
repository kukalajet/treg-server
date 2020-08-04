import { Module } from '@nestjs/common';
import { ProductsService } from './listings.service';
import { ProductsController } from './listings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepository } from './listing.repository';
import { AuthModule } from 'src/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductRepository]),
    MulterModule.register({ dest: '../uploads' }),
    AuthModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}