import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { Request } from 'express';

@Injectable()
export class TokenAuthGuard implements CanActivate {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest<Request>();
    const token = req.get('Authorization');
    if (!token) {
      return false;
    }
    const user: UserDocument | null = await this.userModel.findOne({
      token: token,
    });
    if (!user) {
      return false;
    }
    req.user = user;
    return true;
  }
}
