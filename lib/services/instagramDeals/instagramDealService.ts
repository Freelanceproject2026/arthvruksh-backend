import { QueryFilter } from 'mongoose';

import { connectDB } from '@/lib/mongodb';
import InstagramDeal, { IInstagramDeal, InstagramDealStatus } from '@/models/InstagramDeal';

import { extractInstagramPostId } from './instagramDealValidation';

const HOMEPAGE_DEALS_LIMIT = 12;

// Featured deals first, then manual displayOrder (ascending), then newest first as a tiebreaker.
const DEAL_SORT_ORDER = { featured: -1, displayOrder: 1, createdAt: -1 } as const;

/* ----------------------------------------
   Types
---------------------------------------- */

export interface CreateDealInput {
  instagramUrl: string;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  displayOrder?: number;
  featured?: boolean;
  createdBy: string;
}

export interface UpdateDealInput {
  instagramUrl?: string;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  status?: InstagramDealStatus;
  displayOrder?: number;
  featured?: boolean;
}

export interface ListDealsOptions {
  page: number;
  limit: number;
  search?: string;
  status?: InstagramDealStatus;
}

export interface ListDealsResult {
  deals: IInstagramDeal[];
  totalRecords: number;
}

/* ----------------------------------------
   Create
---------------------------------------- */

export async function createDeal(data: CreateDealInput): Promise<IInstagramDeal> {
  await connectDB();

  const instagramUrl = data.instagramUrl.trim();

  const deal = await InstagramDeal.create({
    instagramUrl,
    instagramPostId: extractInstagramPostId(instagramUrl),
    title: data.title?.trim(),
    description: data.description?.trim(),
    thumbnailUrl: data.thumbnailUrl?.trim(),
    displayOrder: data.displayOrder,
    featured: data.featured,
    createdBy: data.createdBy,
  });

  return deal;
}

/* ----------------------------------------
   Update
---------------------------------------- */

export async function updateDeal(
  id: string,
  updates: UpdateDealInput
): Promise<IInstagramDeal | null> {
  await connectDB();

  const setFields: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (updates.instagramUrl !== undefined) {
    const instagramUrl = updates.instagramUrl.trim();

    setFields.instagramUrl = instagramUrl;
    setFields.instagramPostId = extractInstagramPostId(instagramUrl);
  }

  if (updates.title !== undefined) {
    setFields.title = updates.title.trim();
  }

  if (updates.description !== undefined) {
    setFields.description = updates.description.trim();
  }

  if (updates.thumbnailUrl !== undefined) {
    setFields.thumbnailUrl = updates.thumbnailUrl.trim();
  }

  if (updates.status !== undefined) {
    setFields.status = updates.status;
  }

  if (updates.displayOrder !== undefined) {
    setFields.displayOrder = updates.displayOrder;
  }

  if (updates.featured !== undefined) {
    setFields.featured = updates.featured;
  }

  return InstagramDeal.findByIdAndUpdate(
    id,
    { $set: setFields },
    { new: true }
  );
}

/* ----------------------------------------
   Soft Delete
---------------------------------------- */

export async function softDeleteDeal(id: string): Promise<IInstagramDeal | null> {
  await connectDB();

  return InstagramDeal.findByIdAndUpdate(
    id,
    {
      $set: {
        status: 'inactive',
        updatedAt: new Date(),
      },
    },
    { new: true }
  );
}

/* ----------------------------------------
   Get Single Deal
---------------------------------------- */

export async function getDealById(id: string): Promise<IInstagramDeal | null> {
  await connectDB();

  return InstagramDeal.findById(id).lean();
}

export async function getActiveDealById(id: string): Promise<IInstagramDeal | null> {
  await connectDB();

  return InstagramDeal.findOne({
    _id: id,
    status: 'active',
  }).lean();
}

/* ----------------------------------------
   List Deals (Admin - all statuses)
---------------------------------------- */

export async function listDeals(options: ListDealsOptions): Promise<ListDealsResult> {
  await connectDB();

  const { page, limit, search, status } = options;

  const skip = (page - 1) * limit;

  const query: QueryFilter<IInstagramDeal> = {};

  if (status) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { instagramUrl: { $regex: search, $options: 'i' } },
    ];
  }

  const [deals, totalRecords] = await Promise.all([
    InstagramDeal.find(query)
      .sort(DEAL_SORT_ORDER)
      .skip(skip)
      .limit(limit)
      .lean(),
    InstagramDeal.countDocuments(query),
  ]);

  return { deals, totalRecords };
}

/* ----------------------------------------
   List Deals (Public - active only)
---------------------------------------- */

export async function listActiveDeals(
  options: Pick<ListDealsOptions, 'page' | 'limit'>
): Promise<ListDealsResult> {
  return listDeals({
    page: options.page,
    limit: options.limit,
    status: 'active',
  });
}

/* ----------------------------------------
   Count Active Deals (Public)
---------------------------------------- */

export async function countActiveDeals(): Promise<number> {
  await connectDB();

  return InstagramDeal.countDocuments({ status: 'active' });
}

/* ----------------------------------------
   Public Projection
---------------------------------------- */

export interface PublicInstagramDeal {
  _id: string;
  instagramUrl: string;
  instagramPostId?: string;
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  createdAt: Date;
}

export function toPublicDeal(deal: IInstagramDeal): PublicInstagramDeal {
  return {
    _id: deal._id.toString(),
    instagramUrl: deal.instagramUrl,
    instagramPostId: deal.instagramPostId,
    title: deal.title,
    description: deal.description,
    thumbnailUrl: deal.thumbnailUrl,
    createdAt: deal.createdAt,
  };
}

/* ----------------------------------------
   Homepage (Public - single combined call)
---------------------------------------- */

export interface HomepageDeal {
  _id: string;
  instagramUrl: string;
  title?: string;
  thumbnailUrl?: string;
  createdAt: Date;
}

export interface HomepageDealsResult {
  count: number;
  latestDeals: HomepageDeal[];
}

export function toHomepageDeal(deal: IInstagramDeal): HomepageDeal {
  return {
    _id: deal._id.toString(),
    instagramUrl: deal.instagramUrl,
    title: deal.title,
    thumbnailUrl: deal.thumbnailUrl,
    createdAt: deal.createdAt,
  };
}

export async function getHomepageDeals(): Promise<HomepageDealsResult> {
  await connectDB();

  const [deals, count] = await Promise.all([
    InstagramDeal.find({ status: 'active' })
      .sort(DEAL_SORT_ORDER)
      .limit(HOMEPAGE_DEALS_LIMIT)
      .lean(),
    InstagramDeal.countDocuments({ status: 'active' }),
  ]);

  return {
    count,
    latestDeals: deals.map(toHomepageDeal),
  };
}

/* ----------------------------------------
   Dashboard Stats (Admin)
---------------------------------------- */

export interface InstagramDealStats {
  total: number;
  active: number;
  inactive: number;
  addedToday: number;
  addedThisWeek: number;
}

export async function getInstagramDealStats(
  todayStart: Date,
  weekStart: Date
): Promise<InstagramDealStats> {
  await connectDB();

  const [total, active, inactive, addedToday, addedThisWeek] = await Promise.all([
    InstagramDeal.countDocuments(),
    InstagramDeal.countDocuments({ status: 'active' }),
    InstagramDeal.countDocuments({ status: 'inactive' }),
    InstagramDeal.countDocuments({ createdAt: { $gte: todayStart } }),
    InstagramDeal.countDocuments({ createdAt: { $gte: weekStart } }),
  ]);

  return { total, active, inactive, addedToday, addedThisWeek };
}
