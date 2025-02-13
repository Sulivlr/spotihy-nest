import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Album, AlbumDocument } from '../schemas/albums.schema';
import { CreateAlbumDto } from './create-album.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('albums')
export class AlbumsController {
  constructor(
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
  ) {}

  @Get()
  async getAlbums() {
    return this.albumModel.find();
  }

  @Get(':id')
  getOneAlbum(@Param('id') id: string) {
    return this.albumModel.findById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', { dest: './public/images' }))
  async createAlbum(
    @Body() albumDto: CreateAlbumDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.albumModel.create({
      artist: albumDto.artist,
      title: albumDto.title,
      created_at: albumDto.created_at,
      image: file ? file.filename : null,
    });
  }

  @Delete(':id')
  async deleteAlbum(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Wrong ID');
    }
    const album = await this.albumModel.findByIdAndDelete(id);
    if (!album) {
      throw new BadRequestException('Album not found');
    }
    return 'SUCCESSFULLY DELETED!';
  }
}
