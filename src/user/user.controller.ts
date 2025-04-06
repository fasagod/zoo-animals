import { Controller, Get } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  async getAll() {
    const usersList = await this.userService.findAll();
    return usersList;
  }
}
