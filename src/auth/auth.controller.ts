import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// import { Tokens } from 'src/types/tokens.types';
import { Tokens } from '../types/tokens.types';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup({
      email: dto.email,
      password: dto.password,
    });
  }

  @Post('login')
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  logout(@Req() req) {
    console.log(req.user);
    return this.authService.logout(+req.user.id);
  }

  @Post('refresh')
  // refresh(@Body() body): Promise<Tokens> {
  refresh(@Body() body) {
    return this.authService.refreshTokens(+body.id, body.rt);
    // return this.authService.generateTokens(1, 'lala');
  }
}
