import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Album } from './albums.schema';
import { Artist } from './artists.schema';

export type TrackDocument = Artist & Document;

@Schema()
export class Track {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Album' })
  album: Album;

  @Prop({ required: true })
  title: string;

  @Prop()
  duration: string;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
