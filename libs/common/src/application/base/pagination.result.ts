
export type PaginatedFindResult<T> = {
    items: T[];
    limit: number;
    currentPage: number;
    totalPages: number;
  };