import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { SECRET } from 'src/config';
import { UserService } from './user.service';
import { IUser } from './user.interface';
import { User } from './user.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(
    req: Request & { user?: User & { id?: number } },
    res: Response,
    next: NextFunction,
  ) {
    const authHeaders = req.headers.authorization;
    console.log('authHeaders ', authHeaders);
    if (authHeaders && authHeaders.split(' ')[1]) {
      const token = authHeaders.split(' ')[1];
      try {
        const decoded = jwt.verify(token, SECRET) as IUser;
        const user: User | null = await this.userService.findById(decoded.id);

        if (!user) {
          throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
        }

        req.user = { ...user };
        req.user.id = decoded.id;
        next();
      } catch (error) {
        console.log(error);
        throw new HttpException(
          'Error occured while verify token',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  }
}
