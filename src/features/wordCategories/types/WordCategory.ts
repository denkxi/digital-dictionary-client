export interface WordCategory {
    id: string;
    name: string;
    description?: string;
    createdBy: string;
    createdAt: string;
  }

  export type NewWordCategory = Omit<WordCategory, 'id' | 'createdAt' | 'createdBy'>;
  