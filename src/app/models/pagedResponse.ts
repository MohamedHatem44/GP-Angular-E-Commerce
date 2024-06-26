export interface PagedResponse<T> {
  categoryId: number;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  items: T[];
}
