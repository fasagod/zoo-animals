import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() data: { token: string }) {
    console.log(data.token);
    const user = await this.userService.findByToken(data.token);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const apiToken = this.authService.generateToken(user);
    return { accessToken: apiToken };
  }
}
