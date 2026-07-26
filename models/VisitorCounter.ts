import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVisitorCounter extends Document {
  key: string;

  count: number;

  updatedAt: Date;
}

const VisitorCounterSchema = new Schema<IVisitorCounter>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'global',
    },

    count: {
      type: Number,
      required: true,
      default: 0,
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

const VisitorCounter: Model<IVisitorCounter> =
  mongoose.models.VisitorCounter ||
  mongoose.model<IVisitorCounter>('VisitorCounter', VisitorCounterSchema);

export default VisitorCounter;
