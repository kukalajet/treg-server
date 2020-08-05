import { EntityRepository, Repository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import * as bcrypt from 'bcryptjs';
import { ConflictException, InternalServerErrorException, Logger } from "@nestjs/common";
import { GetUsersFilterDto } from "src/users/dto/get-users-filter.dto";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  private logger = new Logger('UserRepository');

  public async signUp(
    authCredentialsDto: AuthCredentialsDto
  ): Promise<void> {
    const { name, email, password } = authCredentialsDto;

    const user = this.create();
    user.name = name;
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    // Testing
    // user.longitude = 41.511481
    // user.latitude = 19.7928484
    
    // user.longitude = 41.5094765;
    // user.latitude = 19.7710732;

    // user.longitude = 38.8937091;
    // user.latitude = -77.0846159;

    // Tirana
    // user.longitude = 41.3253167;
    // user.latitude = 19.7841115;

    // Elbasan
    // user.longitude = 41.1110657;
    // user.latitude = 20.0581748;

    // Vlore
    user.longitude = 40.450873;
    user.latitude = 19.4464869;

    console.log(user);

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') { // duplicate email
        throw new ConflictException('Email already exists');
      } else {
        console.log(error.stack);
        throw new InternalServerErrorException();
      }
    }
  }

  public async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto
  ): Promise<string> {
    const { email, password } = authCredentialsDto;
    const user = await this.findOne({ email });

    if (user && await user.validatePassword(password)) {
      return user.email;
    } else {
      return null;
    }
  }

  public async getUsers(
    filterDto: GetUsersFilterDto,
    user: User
  ): Promise<User[]> {
    const { distance } = filterDto;
    const query = this.createQueryBuilder('user');

    // TODO: Refactor and split the query in various parts.
    // https://github.com/AlaaMezian/SpringBoot-Haversine-Jwt/blob/master/src/main/java/com/example/repository/ClientRepository.java
    const haversinePart = '(6371 * acos(cos(radians(:latitude)) * cos(radians(user.latitude)) * cos(radians(user.longitude) - radians(:longitude)) + sin(radians(:latitude)) * sin(radians(user.latitude))))';
    query.where(
      `${haversinePart} < :distance ORDER BY ${haversinePart} DESC`,
      { latitude: user.latitude, longitude: user.longitude, distance }
    );

    try {
      const users = await query.getMany();
      return users;
    } catch(error) {
      this.logger.error(`Failed to get users from position "[${user.id}]". Filters: ${JSON.stringify(filterDto)}`, error.stack);
      throw new InternalServerErrorException();
    }
  }
 
  private async hashPassword(
    password: string,
    salt: string
  ): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}