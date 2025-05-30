export interface Dictionary {
    id: string;
    name: string;
    sourceLanguage: string;
    targetLanguage: string;
    description?: string;
    createdBy: string;
    createdAt: string;
    updatedAt?: string;
  }
  
export type NewDictionary = Omit<Dictionary, 'id' | 'createdAt' | 'createdBy'>;
