export interface UserSummary {
    userId: string;
    totalQuizzes: number;
    perfectScores: number;
    totalMistakes: number;
    mostMissedWordIds: string[];
    averageScorePercent: number;
}

export interface DictionaryStats {
    dictionaryId: string;
    totalWords: number;
    learnedWords: number;
    percentageLearned: number;
    quizzesTaken: number;
    averageQuizScore: number;
  }