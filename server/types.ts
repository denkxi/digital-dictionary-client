export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

export interface Dictionary {
  id: string;
  name: string;
  sourceLanguage: string;
  targetLanguage: string;
  description?: string;
  createdBy: string;
  createdAt: string;
}

export interface UserDictionary {
  id: string;
  userId: string;
  dictionaryId: string;
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
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
}

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
  createdAt: string;
}

export interface QuizResultSummary {
  correctCount: number;
  incorrectCount: number;
  totalCount: number;
  scorePercent: number;
  durationSeconds?: number;
}

// export interface QuizPreset {
//   id: string;
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
  id: string;
  userId: string;
  dictionaryId: string;
  questionType: QuestionType;
  wordCount: number;
  createdAt: string;
  completedAt?: string;
  result?: QuizResultSummary;
}

export interface Question {
  id: string;
  quizId: string;
  wordId: string;
  type: QuestionType;
  prompt: string;
  choices: string[];
  correctAnswer: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

// export interface UserStats {
//   userId: string;
//   totalQuizzes: number;
//   perfectScores: number;
//   totalMistakes: number;
//   mostMissedWordIds: string[];
// };

