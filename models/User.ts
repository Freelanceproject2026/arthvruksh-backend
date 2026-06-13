import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  mobile: string;
  isVerified: boolean;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

const User: Model<IUser> =
  mongoose.models.User ||
  mongoose.model<IUser>('User', UserSchema);

export default User;