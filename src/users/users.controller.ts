import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { User, UserDocument } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterUserDto } from './register-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { TokenAuthGuard } from '../auth/token-auth.guard';

@Controller('users')
export class UsersController {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  @Post()
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    const user: UserDocument = new this.userModel({
      email: registerUserDto.email,
      password: registerUserDto.password,
      displayName: registerUserDto.displayName,
    });
    user.generateToken();
    return user.save();
  }

  @UseGuards(AuthGuard('local'))
  @Post('sessions')
  login(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(TokenAuthGuard)
  @Get('secret')
  secret(@Req() req: Request) {
    const user = req.user as UserDocument;
    return { message: 'Secret message', email: user.email };
  }
}
