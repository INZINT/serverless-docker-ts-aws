import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export interface User {
  email?: string;
  password?: string;
}

export interface UserModel extends User, Document {}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true },
  },

  {
    versionKey: false,
    timestamps: true,
  }
);

const UserModels = mongoose.model<UserModel>('user', UserSchema);
export default UserModels;
