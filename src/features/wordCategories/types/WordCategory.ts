export interface WordCategory {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
}

export type NewWordCategory = Omit<WordCategory, 'id' | 'createdAt' | 'createdBy'>;

export type WordCategorySearch = {
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export type WordCategoryResponse = {
  items: WordCategory[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}