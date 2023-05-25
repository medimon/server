import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // constructor(private jwtService: JwtService) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'atsecret', // Replace with your secret key
    });
  }

  async validate(payload: any) {
    console.log('yessss')
    
    // You can add additional validation logic here
    // return { userId: payload.sub, username: payload.username };
    return payload
  }
}
