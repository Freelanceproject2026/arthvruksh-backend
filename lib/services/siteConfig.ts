import { connectDB } from '@/lib/mongodb';
import SiteConfig, {
  ISiteConfig,
  IAnnouncement,
  DEFAULT_ANNOUNCEMENT,
} from '@/models/SiteConfig';

const GLOBAL_KEY = 'global';

export async function getSiteConfig(): Promise<ISiteConfig> {
  await connectDB();

  const config = await SiteConfig.findOneAndUpdate(
    {
      key: GLOBAL_KEY,
    },
    {
      $setOnInsert: {
        key: GLOBAL_KEY,
        sipBook: 10000,
        sipBookLabel: 'SIP Book',
        sipBookVisible: true,
        aum: null,
        aumLabel: 'AUM (Annualized)',
        aumVisible: true,
        announcement: DEFAULT_ANNOUNCEMENT,
      },
    },
    {
      upsert: true,
      new: true,
    }
  );

  return config;
}

export interface SipBookUpdate {
  sipBook?: number;
  sipBookLabel?: string;
  sipBookVisible?: boolean;
}

export async function updateSipBook(data: SipBookUpdate): Promise<ISiteConfig> {
  await connectDB();

  const $set: Record<string, unknown> = { updatedAt: new Date() };
  if (data.sipBook !== undefined) $set.sipBook = data.sipBook;
  if (data.sipBookLabel !== undefined) $set.sipBookLabel = data.sipBookLabel;
  if (data.sipBookVisible !== undefined) $set.sipBookVisible = data.sipBookVisible;

  const config = await SiteConfig.findOneAndUpdate(
    {
      key: GLOBAL_KEY,
    },
    {
      $set,
      $setOnInsert: {
        key: GLOBAL_KEY,
        aum: null,
        aumLabel: 'AUM (Annualized)',
        aumVisible: true,
        announcement: DEFAULT_ANNOUNCEMENT,
      },
    },
    {
      upsert: true,
      new: true,
    }
  );

  return config;
}

export interface AumUpdate {
  aum?: number | null;
  aumLabel?: string;
  aumVisible?: boolean;
}

export async function updateAUM(data: AumUpdate): Promise<ISiteConfig> {
  await connectDB();

  const $set: Record<string, unknown> = { updatedAt: new Date() };
  if (data.aum !== undefined) $set.aum = data.aum;
  if (data.aumLabel !== undefined) $set.aumLabel = data.aumLabel;
  if (data.aumVisible !== undefined) $set.aumVisible = data.aumVisible;

  const config = await SiteConfig.findOneAndUpdate(
    {
      key: GLOBAL_KEY,
    },
    {
      $set,
      $setOnInsert: {
        key: GLOBAL_KEY,
        sipBook: 10000,
        sipBookLabel: 'SIP Book',
        sipBookVisible: true,
        announcement: DEFAULT_ANNOUNCEMENT,
      },
    },
    {
      upsert: true,
      new: true,
    }
  );

  return config;
}

export type AnnouncementUpdate = Partial<IAnnouncement>;

export async function updateAnnouncement(
  data: AnnouncementUpdate
): Promise<ISiteConfig> {
  await connectDB();

  const $set: Record<string, unknown> = { updatedAt: new Date() };
  for (const [field, value] of Object.entries(data)) {
    if (value !== undefined) $set[`announcement.${field}`] = value;
  }

  const config = await SiteConfig.findOneAndUpdate(
    {
      key: GLOBAL_KEY,
    },
    {
      $set,
      $setOnInsert: {
        key: GLOBAL_KEY,
        sipBook: 10000,
        sipBookLabel: 'SIP Book',
        sipBookVisible: true,
        aum: null,
        aumLabel: 'AUM (Annualized)',
        aumVisible: true,
      },
    },
    {
      upsert: true,
      new: true,
    }
  );

  return config;
}
