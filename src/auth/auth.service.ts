import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { Tokens } from '../types/tokens.types';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'types/jwtPayload.tyes';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    //generate pw hash
    const hash = await argon.hash(dto.password);

    //insert email + hash
    let user = await this.prisma.user
      .create({
        data: { email: dto.email, hash },
      })
      .catch((error) => {
        console.log(error.code);
        // if (e === PrismaClientKnownRequestError)
        // throw new ForbiddenException('Credentials incorrect');
        if (error instanceof PrismaClientKnownRequestError) {
          // throw error.code;
          throw new ForbiddenException('Credentials incorrect');
        }
        throw error;
      });

    //generatetokens (userId)
    const tokens = await this.generateTokens(user.id);

    //generate rt hash
    const RtHash = await argon.hash(tokens.refresh_token);

    //store rthash
    user = await this.prisma.user.update({
      where: { id: user.id },
      data: { hashedRt: RtHash },
    });

    //return {at,rt}
    return tokens;
  }

  async login(email: string, password: string): Promise<Tokens> {
    const hash = await argon.hash(password);
    // console.log(password);
    // console.log(email, hash);
    const user = await this.prisma.user.findFirst({ where: { email } });
    // console.log(user.hash);
    // console.log(hash);

    if (!user) throw new Error('wrong!');

    const passwordMatches = await argon.verify(user.hash, password);
    // if (!passwordMatches) throw new Error('passss');
    if (!passwordMatches) throw new Error('passss');

    const tokens = this.generateTokens(user.id);
    return tokens;
  }

  async refreshTokens(id: number, rt: string) {
    //get user
    const user = await this.prisma.user.findUnique({ where: { id } });

    //??hash rt, check user.rthash === rthash

    //check user.rthash with hashed rt
    const rtMatches = await argon.verify(user.hashedRt, rt);
    if (!rtMatches) throw new ForbiddenException('access denied');

    //generate at,rt
    const tokens = await this.generateTokens(user.id);

    //update rt
    this.prisma.user.update({
      where: { id: user.id },
      data: { hashedRt: tokens.refresh_token },
    });

    //return {at,rt}
    return tokens;
  }

  async updateRtHash(id: number, rt: string) {
    //check id
    //check rt
    //generatetokens
    //store rt
    const hash = await argon.hash(rt);
    return await this.prisma.user.update({
      where: { id },
      data: { hashedRt: hash },
    });
  }

  async generateTokens(userId: number): Promise<Tokens> {
    let user = await this.prisma.user.findUnique({ where: { id: userId } });

    const JwtPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };
    //create jwt as at using user and secret1
    //create jwt as rt using user and secret2
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(JwtPayload, {
        secret: this.configService.get<string>('AT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(JwtPayload, {
        secret: this.configService.get<string>('RT_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    //return at,rt
    return { access_token: at, refresh_token: rt };
  }

  async logout(userId: number): Promise<Boolean> {
    // const user = await this.prisma.user.findUnique({ where: { id: userId } });

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { hashedRt: null },
    });
    return true;
  }
}
