import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from '../schemas/artists.schema';
import { isValidObjectId, Model } from 'mongoose';
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

  @Delete(':id')
  async deleteArtist(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Wrong ID');
    }
    const artist = await this.artistModel.findByIdAndDelete(id);
    if (!artist) {
      throw new BadRequestException('Artist not found');
    }
    return 'SUCCESSFULLY DELETED!';
  }
}
