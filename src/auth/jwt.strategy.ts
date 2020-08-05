import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRepository } from "./user.repository";
import * as config from 'config';
import { JwtPayload } from "./jwt-payload.interface";
import { User } from "./user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
    });
  }

  public async validate(payload: JwtPayload): Promise<User> {
    const { email } = payload;
    const user = this.userRepository.findOne({ email });
    if (!user) throw new UnauthorizedException();

    return user;
  }
}