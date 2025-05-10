export interface Dictionary {
    _id: string;
    name: string;
    sourceLanguage: string;
    targetLanguage: string;
    description?: string;
    createdBy: string;
    createdAt: string;
  }
  
export type NewDictionary = Omit<Dictionary, '_id' | 'createdAt' | 'createdBy'>;
