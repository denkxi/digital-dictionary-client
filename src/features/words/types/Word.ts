export interface Word {
  id: string;
  writing: string;
  translation: string;
  pronunciation?: string;
  definition?: string;
  useExample?: string;
  wordClass?: WordClass;
  isStarred: boolean;
  isLearned: boolean;
  dictionaryId: string;
  categoryId?: string;
  createdBy: string;
  createdAt: string;
}

export type NewWord = Omit<Word, 'id' | 'createdAt' | 'createdBy'>;

export enum WordClass {
    Noun = 'Noun',
    Verb = 'Verb',
    Adjective = 'Adjective',
    Adverb = 'Adverb',
    Phrase = 'Phrase',
    Expression = 'Expression',
    Exclamation = 'Exclamation',
  }
