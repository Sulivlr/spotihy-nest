import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateTrackDto } from './create.track.dto';
import { Track, TrackDocument } from '../schemas/tracks.schema';
import { Guard } from '../user-role/user-role.guard';
import { TokenAuthGuard } from '../auth/token-auth.guard';

@Controller('tracks')
export class TracksController {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
  ) {}

  @Get()
  async getTracks() {
    return this.trackModel.find();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.trackModel.findById(id);
  }

  @UseGuards(TokenAuthGuard)
  @Post()
  async createTrack(@Body() trackDto: CreateTrackDto) {
    return await this.trackModel.create({
      album: trackDto.album,
      title: trackDto.title,
      duration: trackDto.duration,
    });
  }

  @UseGuards(TokenAuthGuard, new Guard(['admin']))
  @Delete(':id')
  async deleteTrack(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Wrong ID');
    }
    const track = await this.trackModel.findByIdAndDelete(id);
    if (!track) {
      throw new BadRequestException('Track not found');
    }
    return 'SUCCESSFULLY DELETED!';
  }
}
