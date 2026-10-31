import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnnouncement {
  enabled: boolean;
  badge: string;
  highlight: string;
  message: string;
  statValue: string;
  statLabel: string;
  ctaLabel: string;
  ctaHref: string;
  subText: string;
}

export interface ISiteConfig extends Document {
  key: string;

  sipBook: number;
  sipBookLabel: string;
  sipBookVisible: boolean;

  aum: number | null;
  aumLabel: string;
  aumVisible: boolean;

  announcement: IAnnouncement;

  updatedAt: Date;
}


export const DEFAULT_ANNOUNCEMENT: IAnnouncement = {
  enabled: true,
  badge: 'MILESTONE UNLOCKED',
  highlight: '₹2 Cr+',
  message: 'Assets Under Management',
  statValue: '125+',
  statLabel: 'Active Clients',
  ctaLabel: 'Start your SIP',
  ctaHref: '#book-call',
  subText: '',
};

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    enabled: { type: Boolean, required: true, default: DEFAULT_ANNOUNCEMENT.enabled },
    badge: { type: String, required: true, default: DEFAULT_ANNOUNCEMENT.badge },
    highlight: { type: String, default: DEFAULT_ANNOUNCEMENT.highlight },
    message: { type: String, required: true, default: DEFAULT_ANNOUNCEMENT.message },
    statValue: { type: String, default: DEFAULT_ANNOUNCEMENT.statValue },
    statLabel: { type: String, default: DEFAULT_ANNOUNCEMENT.statLabel },
    ctaLabel: { type: String, default: DEFAULT_ANNOUNCEMENT.ctaLabel },
    ctaHref: { type: String, default: DEFAULT_ANNOUNCEMENT.ctaHref },
    subText: { type: String, default: DEFAULT_ANNOUNCEMENT.subText },
  },
  { _id: false }
);

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
    sipBookLabel: {
      type: String,
      required: true,
      default: 'SIP Book',
    },
    sipBookVisible: {
      type: Boolean,
      required: true,
      default: true,
    },

    aum: {
      type: Number,
      default: null,
    },
    aumLabel: {
      type: String,
      required: true,
      default: 'AUM (Annualized)',
    },
    aumVisible: {
      type: Boolean,
      required: true,
      default: true,
    },

    announcement: {
      type: AnnouncementSchema,
      required: true,
      default: () => ({ ...DEFAULT_ANNOUNCEMENT }),
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
