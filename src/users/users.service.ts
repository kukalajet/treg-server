import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/user.repository';
import { User } from 'src/auth/user.entity';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {}

  public async getUsers(
    filterDto: GetUsersFilterDto,
    user: User
  ): Promise<User[]> {
    return this.userRepository.getUsers(filterDto, user);
  }

  public async getUserById(
    id: number,
    user: User
  ): Promise<User> {
    const found = await this.userRepository.findOne({ where: { id } });
    if (!found) throw new NotFoundException(`User with ID "${id}" not found`);
    
    return found;
  }
}
