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

export type NewWord = Omit<Word, 'id' | 'createdAt'>;

export enum WordClass {
    Noun = 'Noun',
    Verb = 'Verb',
    Adjective = 'Adjective',
    Adverb = 'Adverb',
    Phrase = 'Phrase',
    Expression = 'Expression',
  }
