import { connectDB } from '@/lib/mongodb';
import VisitorCounter from '@/models/VisitorCounter';

const GLOBAL_KEY = 'global';

export async function getVisitorCount(): Promise<number> {
  await connectDB();

  const counter = await VisitorCounter.findOne({ key: GLOBAL_KEY });

  return counter?.count ?? 0;
}

export async function incrementVisitorCount(): Promise<number> {
  await connectDB();

  const counter = await VisitorCounter.findOneAndUpdate(
    {
      key: GLOBAL_KEY,
    },
    {
      $inc: { count: 1 },
      $set: { updatedAt: new Date() },
    },
    {
      upsert: true,
      new: true,
    }
  );

  return counter.count;
}
