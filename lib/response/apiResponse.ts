import { corsResponse } from '@/lib/cors';

export function successResponse(
  origin: string | null | undefined,
  data: Record<string, unknown> = {},
  status = 200
) {
  return corsResponse(
    {
      success: true,
      ...data,
    },
    status,
    origin
  );
}

export function errorResponse(
  origin: string | null | undefined,
  message: string,
  status = 500,
  extra: Record<string, unknown> = {}
) {
  return corsResponse(
    {
      success: false,
      message,
      ...extra,
    },
    status,
    origin
  );
}

export function paginatedResponse(
  origin: string | null | undefined,
  data: unknown[],
  pagination: {
    page: number;
    limit: number;
    count: number;
    totalPages: number;
    totalRecords: number;
  },
  options?: {
    filters?: Record<string, unknown>;
    sorting?: Record<string, unknown>;
    status?: number;
  }
) {
  return corsResponse(
    {
      success: true,

      pagination,

      ...(options?.filters && {
        filters: options.filters,
      }),

      ...(options?.sorting && {
        sorting: options.sorting,
      }),

      data,
    },
    options?.status ?? 200,
    origin
  );
}