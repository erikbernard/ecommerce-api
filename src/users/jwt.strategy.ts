import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import jwtConstantsConfig from 'src/common/config/jwtConstants.config';
import { JwtToken } from 'src/common/interfaces/jwt-token.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstantsConfig().secret || "defaultSecret",
    });
  }

  async validate(payload: JwtToken) {
    console.log('JWT Payload:', payload);
    return { userId: payload.id, username: payload.name, email: payload.email };
  }
}