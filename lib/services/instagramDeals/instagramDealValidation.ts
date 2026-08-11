import InstagramDeal from '@/models/InstagramDeal';

// Accepts: https://www.instagram.com/p/XXXXX/, https://instagram.com/reel/XXXXX/,
// https://www.instagram.com/tv/XXXXX/ (with or without "www.", with or without a
// trailing slash, and an optional query string or fragment, e.g. "?utm_source=...").
// Rejects bare domains, non-post paths (/profile, /explore), and anything with
// extra content that isn't a valid query/fragment suffix.
const INSTAGRAM_URL_REGEX =
  /^https?:\/\/(?:www\.)?instagram\.com\/(p|reel|tv)\/([A-Za-z0-9_-]+)\/?(?:[?#][^\s]*)?$/i;

export const ALLOWED_STATUSES = ['active', 'inactive'] as const;

// Caps how many deals can be featured (i.e. pinned to the top) at once, so
// "featured" stays meaningful instead of every deal eventually getting flagged.
export const MAX_FEATURED_DEALS = 3;

export type ValidationResult =
  | { valid: true }
  | { valid: false; message: string };

/* ----------------------------------------
   Instagram URL Validation
---------------------------------------- */

export function isValidInstagramUrl(url: unknown): url is string {
  return typeof url === 'string' && INSTAGRAM_URL_REGEX.test(url.trim());
}

export function extractInstagramPostId(url: string): string | undefined {
  const match = url.trim().match(INSTAGRAM_URL_REGEX);

  return match ? match[2] : undefined;
}

/* ----------------------------------------
   Create Payload Validation
---------------------------------------- */

export function validateCreatePayload(body: {
  instagramUrl?: unknown;
  title?: unknown;
  description?: unknown;
  thumbnailUrl?: unknown;
  displayOrder?: unknown;
  featured?: unknown;
}): ValidationResult {
  if (!body.instagramUrl || typeof body.instagramUrl !== 'string' || !body.instagramUrl.trim()) {
    return { valid: false, message: 'instagramUrl is required' };
  }

  if (!isValidInstagramUrl(body.instagramUrl)) {
    return { valid: false, message: 'instagramUrl must be a valid Instagram post, reel, or tv URL' };
  }

  if (body.title !== undefined && typeof body.title !== 'string') {
    return { valid: false, message: 'title must be a string' };
  }

  if (body.description !== undefined && typeof body.description !== 'string') {
    return { valid: false, message: 'description must be a string' };
  }

  if (body.thumbnailUrl !== undefined && typeof body.thumbnailUrl !== 'string') {
    return { valid: false, message: 'thumbnailUrl must be a string' };
  }

  if (body.displayOrder !== undefined && !isValidDisplayOrder(body.displayOrder)) {
    return { valid: false, message: 'displayOrder must be a non-negative integer' };
  }

  if (body.featured !== undefined && typeof body.featured !== 'boolean') {
    return { valid: false, message: 'featured must be a boolean' };
  }

  return { valid: true };
}

/* ----------------------------------------
   Update Payload Validation
---------------------------------------- */

export function validateUpdatePayload(body: {
  instagramUrl?: unknown;
  title?: unknown;
  description?: unknown;
  thumbnailUrl?: unknown;
  status?: unknown;
  displayOrder?: unknown;
  featured?: unknown;
}): ValidationResult {
  if (body.instagramUrl !== undefined && !isValidInstagramUrl(body.instagramUrl)) {
    return { valid: false, message: 'instagramUrl must be a valid Instagram post, reel, or tv URL' };
  }

  if (body.title !== undefined && typeof body.title !== 'string') {
    return { valid: false, message: 'title must be a string' };
  }

  if (body.description !== undefined && typeof body.description !== 'string') {
    return { valid: false, message: 'description must be a string' };
  }

  if (body.thumbnailUrl !== undefined && typeof body.thumbnailUrl !== 'string') {
    return { valid: false, message: 'thumbnailUrl must be a string' };
  }

  if (
    body.status !== undefined &&
    !ALLOWED_STATUSES.includes(body.status as (typeof ALLOWED_STATUSES)[number])
  ) {
    return { valid: false, message: 'status must be one of: active, inactive' };
  }

  if (body.displayOrder !== undefined && !isValidDisplayOrder(body.displayOrder)) {
    return { valid: false, message: 'displayOrder must be a non-negative integer' };
  }

  if (body.featured !== undefined && typeof body.featured !== 'boolean') {
    return { valid: false, message: 'featured must be a boolean' };
  }

  return { valid: true };
}

/* ----------------------------------------
   Display Order Validation
---------------------------------------- */

function isValidDisplayOrder(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

/* ----------------------------------------
   Duplicate Checking
---------------------------------------- */

export async function isDuplicateInstagramUrl(
  instagramUrl: string,
  excludeId?: string
): Promise<boolean> {
  const existing = await InstagramDeal.findOne({
    instagramUrl: instagramUrl.trim(),
    ...(excludeId && { _id: { $ne: excludeId } }),
  }).lean();

  return !!existing;
}

/* ----------------------------------------
   Featured Limit Checking
---------------------------------------- */

// True once MAX_FEATURED_DEALS active deals are already featured, i.e. one
// more featured+active deal would exceed the cap. Only active deals count,
// since inactive/soft-deleted deals never show up in the public feed.
export async function isFeaturedLimitReached(excludeId?: string): Promise<boolean> {
  const count = await InstagramDeal.countDocuments({
    featured: true,
    status: 'active',
    ...(excludeId && { _id: { $ne: excludeId } }),
  });

  return count >= MAX_FEATURED_DEALS;
}
