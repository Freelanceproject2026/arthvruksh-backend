import mongoose, { Schema, Document, Model } from 'mongoose';

export type InstagramDealStatus = 'active' | 'inactive';

export interface IInstagramDeal extends Document {
  instagramUrl: string;

  instagramPostId?: string;

  title?: string;

  description?: string;

  thumbnailUrl?: string;

  status: InstagramDealStatus;

  displayOrder: number;

  featured: boolean;

  createdBy: mongoose.Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}

const InstagramDealSchema = new Schema<IInstagramDeal>(
  {
    instagramUrl: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    instagramPostId: {
      type: String,
      trim: true,
    },

    title: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    thumbnailUrl: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
      index: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

// Matches the public/homepage sort order (status filter + featured/displayOrder/createdAt sort).
InstagramDealSchema.index({ status: 1, featured: -1, displayOrder: 1, createdAt: -1 });

const InstagramDeal: Model<IInstagramDeal> =
  mongoose.models.InstagramDeal ||
  mongoose.model<IInstagramDeal>('InstagramDeal', InstagramDealSchema);

export default InstagramDeal;
