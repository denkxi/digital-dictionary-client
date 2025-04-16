export interface Dictionary {
    id: number;
    name: string;
    sourceLanguage: string;
    targetLanguage: string;
    description?: string;
    createdBy: number;
    createdAt: string;
  }
  
export type NewDictionary = Omit<Dictionary, 'id' | 'createdAt' | 'createdBy'>;
