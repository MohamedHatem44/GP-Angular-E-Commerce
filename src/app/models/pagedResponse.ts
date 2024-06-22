export interface PagedResponse<T> {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  items: T[];
}
