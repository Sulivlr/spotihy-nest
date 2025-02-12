import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Album, AlbumDocument } from '../schemas/albums.schema';
import { CreateAlbumDto } from './create-album.dto';

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
  async createAlbum(@Body() albumDto: CreateAlbumDto) {
    return this.albumModel.create({
      artist: albumDto.artist,
      title: albumDto.title,
      created_at: albumDto.created_at,
    });
  }
}
