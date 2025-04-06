import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/user/user.entity';
import { SECRET } from 'src/config';

@Injectable()
export class AuthService {
  constructor() {}

  generateToken(user: User): string {
    const payload = { id: user.id, phone: user.phone, fio: user.fio };
    return jwt.sign(payload, SECRET);
  }
}
