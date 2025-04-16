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
  Noun = "Noun",
  Verb = "Verb",
  Adjective = "Adjective",
  Adverb = "Adverb",
  Phrase = "Phrase",
  Expression = "Expression",
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

export interface QuizResultSummary {
  correct: number;
  incorrect: number;
  total: number;
  scorePercent: number;
  durationSeconds?: number;
}

// export interface QuizPreset {
//   id: number;
//   name: string; // "Only Translations (10 Words)"
//   userId: number | null; // null = global default
//   questionType: 'translation' | 'writing' | 'mixed';
//   wordCount: number;
// };


export enum QuestionType {
  Translation = 'translation',
  Writing = 'writing',
  Pronunciation = 'pronunciation',
  Mixed = 'mixed'
}

export interface Quiz {
  id: number;
  userId: number;
  dictionaryId: number;
  questionType: QuestionType;
  wordCount: number;
  createdAt: string;
  completedAt?: string;
  result?: QuizResultSummary;
}

export interface Question {
  id: number;
  quizId: number;
  wordId: number;
  type: QuestionType;
  prompt: string;
  choices: string[];
  correctAnswer: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

// export interface UserStats {
//   userId: number;
//   totalQuizzes: number;
//   perfectScores: number;
//   totalMistakes: number;
//   mostMissedWordIds: number[];
// };

