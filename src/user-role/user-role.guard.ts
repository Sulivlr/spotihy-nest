import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../schemas/user.schema';
import { Request } from 'express';

@Injectable()
export class Guard implements CanActivate {
  constructor(private userRole: string[]) {}
  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();
    const user = req.user as User;
    if (!user || !this.userRole.includes(user.role)) {
      throw new UnauthorizedException('Lack of Access');
    }
    req.user = user;
    return true;
  }
}
