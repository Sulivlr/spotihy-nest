import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { randomUUID } from 'crypto';
import { compare, genSalt, hash } from 'bcrypt';

const SALT_WORK_FACTOR = 10;

export interface UserDocument extends Document {
  email: string;
  password: string;
  displayName?: string;
  token: string;
  generateToken: () => void;
  checkPassword: (password: string) => Promise<boolean>;
}

export enum UserRoles {
  admin = 'admin',
  user = 'user',
}

@Schema()
export class User {
  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  token: string;

  @Prop()
  displayName: string;

  @Prop({ required: true, enum: UserRoles, default: UserRoles.user })
  role: UserRoles;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.generateToken = function (this: UserDocument) {
  this.token = randomUUID();
};

UserSchema.methods.checkPassword = function (
  this: UserDocument,
  password: string,
) {
  return compare(password, this.password);
};

UserSchema.pre<UserDocument>('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await genSalt(SALT_WORK_FACTOR);
  this.password = await hash(this.password, salt);
});

UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});
