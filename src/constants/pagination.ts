export const paginationFields = ['page', 'limit', 'sortBy', 'sortOrder'];
export interface PaginationFields {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
