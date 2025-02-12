import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from '../schemas/artists.schema';
import { Model } from 'mongoose';
import { CreateArtistDto } from './create-artist.dto';

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectModel(Artist.name) private artistModel: Model<ArtistDocument>,
  ) {}
  @Get()
  async getArtists() {
    return this.artistModel.find();
  }
  @Get(':id')
  getOneArtist(@Param('id') id: string) {
    return this.artistModel.findById(id);
  }

  @Post()
  async createArtist(
    @Body()
    artistDto: CreateArtistDto,
  ) {
    return await this.artistModel.create({
      name: artistDto.name,
      description: artistDto.description,
    });
  }
}
