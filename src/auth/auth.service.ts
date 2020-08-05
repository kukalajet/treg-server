import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {

  private logger = new Logger('AuthService');

  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  public async signUp(
    authCredentialsDto: AuthCredentialsDto
  ): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  public async signIn(
    authCredentialsDto: AuthCredentialsDto
  ): Promise<{ accessToken: string }> {
    const email = await this.userRepository.validateUserPassword(authCredentialsDto);
    if (!email) throw new UnauthorizedException('Invalid credentials');

    const payload: JwtPayload = { email };
    const accessToken = await this.jwtService.sign(payload);
    this.logger.debug(`Generated JWT Token with payload ${JSON.stringify(payload)}`);

    return { accessToken };
  }
}