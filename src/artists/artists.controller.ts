import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from '../schemas/artists.schema';
import { isValidObjectId, Model } from 'mongoose';
import { CreateArtistDto } from './create-artist.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { Guard } from '../user-role/user-role.guard';

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

  @UseGuards(TokenAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image', { dest: './public/images' }))
  async createArtist(
    @Body()
    artistDto: CreateArtistDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.artistModel.create({
      name: artistDto.name,
      description: artistDto.description,
      image: file ? file.filename : null,
    });
  }

  @UseGuards(TokenAuthGuard, new Guard(['admin']))
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
