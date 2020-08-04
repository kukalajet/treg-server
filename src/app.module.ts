import { Module } from '@nestjs/common';
import { ListingsModule } from './listings/listings.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ListingsModule,
    AuthModule,
    UsersModule
  ],
})
export class AppModule {}
