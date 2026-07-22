import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISiteConfig extends Document {
  key: string;

  sipBook: number;

  aum: number | null;

  updatedAt: Date;
}

const SiteConfigSchema = new Schema<ISiteConfig>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'global',
    },

    sipBook: {
      type: Number,
      required: true,
      default: 10000,
    },

    aum: {
      type: Number,
      default: null,
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

const SiteConfig: Model<ISiteConfig> =
  mongoose.models.SiteConfig ||
  mongoose.model<ISiteConfig>('SiteConfig', SiteConfigSchema);

export default SiteConfig;
