// import { Module } from '@nestjs/common';

// @Module({})
// export class AuthModule {}

import { Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/at.strategy';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ConfigService],
})
export class AuthModule {}
