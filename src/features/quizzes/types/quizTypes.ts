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

  export type QuizWithName = Quiz & { dictionaryName: string };
  
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
  
  export interface QuizResultSummary {
    correctCount: number;
    incorrectCount: number;
    totalCount: number;
    scorePercent: number;
    durationSeconds?: number;
  }
  