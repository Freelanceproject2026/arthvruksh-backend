import { connectDB } from '@/lib/mongodb';
import SiteConfig, { ISiteConfig } from '@/models/SiteConfig';

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
        aum: null,
      },
    },
    {
      upsert: true,
      new: true,
    }
  );

  return config;
}

export async function updateSipBook(value: number): Promise<ISiteConfig> {
  await connectDB();

  const config = await SiteConfig.findOneAndUpdate(
    {
      key: GLOBAL_KEY,
    },
    {
      $set: {
        sipBook: value,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        key: GLOBAL_KEY,
        aum: null,
      },
    },
    {
      upsert: true,
      new: true,
    }
  );

  return config;
}

export async function updateAUM(value: number | null): Promise<ISiteConfig> {
  await connectDB();

  const config = await SiteConfig.findOneAndUpdate(
    {
      key: GLOBAL_KEY,
    },
    {
      $set: {
        aum: value,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        key: GLOBAL_KEY,
        sipBook: 10000,
      },
    },
    {
      upsert: true,
      new: true,
    }
  );

  return config;
}
