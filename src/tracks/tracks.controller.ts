import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTrackDto } from './create.track.dto';
import { Track, TrackDocument } from '../schemas/tracks.schema';

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

  @Post()
  async createTrack(@Body() trackDto: CreateTrackDto) {
    return await this.trackModel.create({
      album: trackDto.album,
      title: trackDto.title,
      duration: trackDto.duration,
    });
  }
}
