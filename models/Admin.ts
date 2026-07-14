import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAdmin extends Document {
  fullName: string;
  email: string;
  passwordHash: string;
  role: 'super_admin';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
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

    passwordHash: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: 'super_admin',
      enum: ['super_admin'],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
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

const Admin: Model<IAdmin> =
  mongoose.models.Admin ||
  mongoose.model<IAdmin>('Admin', AdminSchema);

export default Admin;