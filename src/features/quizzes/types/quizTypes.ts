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
  
  export interface QuizResultSummary {
    correct: number;
    incorrect: number;
    total: number;
    scorePercent: number;
    durationSeconds?: number;
  }
  