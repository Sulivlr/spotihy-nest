import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from '../schemas/artists.schema';
import { Album, AlbumSchema } from '../schemas/albums.schema';
import { Track, TrackSchema } from '../schemas/tracks.schema';
import { User, UserSchema } from '../schemas/user.schema';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/Spotihy2'),
    MongooseModule.forFeature([
      { name: Artist.name, schema: ArtistSchema },
      { name: Album.name, schema: AlbumSchema },
      { name: Track.name, schema: TrackSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [SeederService],
})
export class SeedModule {}
