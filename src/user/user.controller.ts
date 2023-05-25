import { Controller, Get } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  createUser() {
    this.userService
      .createUser({
        email: 'newuserrrr@email.com',
        // name: 'mrnewuser',
        hash: 'dd',
      })
      .then((u) => console.log(u))
      .catch((e) => console.log(e));
    // return 'hahaha';
  }

  @Get('users')
  users() {
    this.userService
      .users()
      .then((u) => console.log(u))
      .catch((e) => console.log(e));
  }
}
