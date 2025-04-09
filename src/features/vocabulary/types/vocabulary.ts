export interface Word {
    id: string;
    word: string;
    translation: string;
    categoryId?: string;
    examples: string[];
    notes?: string;
    createdAt: string;
    learned: boolean;
  }
  
  export interface Category {
    id: string;
    name: string;
    description?: string;
  }
  
  export interface WordsFilter {
    search?: string;
    categoryId?: string;
    learnedStatus?: 'all' | 'learned' | 'notLearned';
    sortBy?: 'createdAt' | 'alphabetical';
    sortOrder?: 'asc' | 'desc';
  }