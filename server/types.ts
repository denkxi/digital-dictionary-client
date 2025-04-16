export interface User {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
  }
  
  export interface Dictionary {
    id: number;
    sourceLanguage: string;
    targetLanguage: string;
    description?: string;
    createdBy: number;
    createdAt: string;
  }
  
  export interface UserDictionary {
    id: number;
    userId: number;
    dictionaryId: number;
  }

  export enum WordClass {
    Noun = 'Noun',
    Verb = 'Verb',
    Adjective = 'Adjective',
    Adverb = 'Adverb',
    Phrase = 'Phrase',
    Expression = 'Expression',
  }

  export interface WordCategory {
    id: number;
    name: string;
    description?: string;
    createdBy: number;
    createdAt: string;
  }

  export interface Word {
    id: number;
    writing: string;
    translation: string;
    pronunciation?: string;
    description?: string;
    wordClass?: WordClass;
    isStarred: boolean;
    isLearned: boolean;
    dictionaryId: number;
    categoryId?: number;
    createdAt: string;
  }
  
  