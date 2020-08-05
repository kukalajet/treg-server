import { Controller, UseGuards, Logger, Get, Query, ValidationPipe, Param, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';

@Controller('users')
@UseGuards(AuthGuard())
export class UsersController {

  private logger = new Logger('UsersController');

  constructor(private usersService: UsersService) {}

  @Get()
  public getUsers(
    @Query(ValidationPipe) filterDto: GetUsersFilterDto,
    @GetUser() user: User
  ) {
    console.log(filterDto);
    this.logger.verbose(`User "${user.name}" retrieving all users. Filters: ${JSON.stringify(filterDto)}`);
    return this.usersService.getUsers(filterDto, user);
  }

  @Get('/:id')
  public getUserById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User
  ) {
    this.logger.verbose(`User "${user.name}" retrieving user "${id}"`);
    return this.usersService.getUserById(id, user);
  }
}