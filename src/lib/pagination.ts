export const ITEMS_PER_PAGE = 21;
export const COLLECTIONS_PER_PAGE = 21;
export const DASHBOARD_COLLECTIONS_LIMIT = 6;
export const DASHBOARD_RECENT_ITEMS_LIMIT = 10;
export const SIDEBAR_RECENT_COLLECTIONS_LIMIT = 3;

export type PaginationInput = {
  page?: number | string | null;
  pageSize: number;
  totalCount: number;
};

export type PaginationResult = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  skip: number;
  take: number;
};

export function parsePageParam(page?: number | string | null) {
  if (typeof page === "number" && Number.isInteger(page) && page > 0) {
    return page;
  }

  if (typeof page === "string") {
    const parsedPage = Number.parseInt(page, 10);

    if (Number.isInteger(parsedPage) && parsedPage > 0) {
      return parsedPage;
    }
  }

  return 1;
}

export function getPagination({
  page,
  pageSize,
  totalCount,
}: PaginationInput): PaginationResult {
  const requestedPage = parsePageParam(page);
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / pageSize) : 0;
  const safePage = totalPages > 0 ? Math.min(requestedPage, totalPages) : 1;

  return {
    page: safePage,
    pageSize,
    totalCount,
    totalPages,
    skip: (safePage - 1) * pageSize,
    take: pageSize,
  };
}
