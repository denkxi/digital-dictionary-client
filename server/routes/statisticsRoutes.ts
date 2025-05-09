import express from 'express';
import { readJSON } from '../utils/db.ts';
import { authenticate } from '../utils/authMiddleware.ts';
import { Question, Quiz, Word } from '../types.ts';

const router = express.Router();

router.get('/user-summary', authenticate, async (req, res) => {
  const userId = (req as any).userId;

  const quizzes = await readJSON<Quiz[]>('quizzes.json');
  const questions = await readJSON<Question[]>('questions.json');

  const userQuizzes = quizzes.filter(q => q.userId === userId && q.result);
  const userQuizIds = userQuizzes.map(q => q.id);

  const userQuestions = questions.filter(q => userQuizIds.includes(q.quizId));

  const totalQuizzes = userQuizzes.length;
  const perfectScores = userQuizzes.filter(q => q.result?.scorePercent === 100).length;

  const mistakeQuestions = userQuestions.filter(q => !q.isCorrect);
  const totalMistakes = mistakeQuestions.length;

  const mistakeFrequency: Record<string, number> = {};
  mistakeQuestions.forEach(q => {
    if (!q.wordId) return;
    mistakeFrequency[q.wordId] = (mistakeFrequency[q.wordId] || 0) + 1;
  });

  const mostMissedWordIds = Object.entries(mistakeFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([wordId]) => wordId);

  const totalScore = userQuizzes.reduce((sum, q) => sum + (q.result?.scorePercent || 0), 0);
  const averageScorePercent = totalQuizzes > 0 ? Math.round(totalScore / totalQuizzes) : 0;

  res.json({
    userId,
    totalQuizzes,
    perfectScores,
    totalMistakes,
    mostMissedWordIds,
    averageScorePercent,
  });
});

router.get('/dictionary-summary', authenticate, async (req, res) => {
  const userId = (req as any).userId;
  const dictionaryId = req.query.dictionaryId;

  if (!dictionaryId || typeof dictionaryId !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid dictionaryId' });
  }

  const words = await readJSON<Word[]>('words.json');
  const quizzes = await readJSON<Quiz[]>('quizzes.json');

  const userWords = words.filter(
    (w) => w.dictionaryId === dictionaryId && w.createdBy === userId
  );

  const totalWords = userWords.length;
  const learnedWords = userWords.filter((w) => w.isLearned).length;
  const percentageLearned =
    totalWords > 0 ? Math.round((learnedWords / totalWords) * 100) : 0;

  const userQuizzes = quizzes.filter(
    (q) => q.dictionaryId === dictionaryId && q.userId === userId && q.result
  );

  const quizzesTaken = userQuizzes.length;
  const totalScore = userQuizzes.reduce((sum, q) => sum + (q.result?.scorePercent || 0), 0);
  const averageQuizScore =
    quizzesTaken > 0 ? Math.round(totalScore / quizzesTaken) : 0;

  res.json({
    dictionaryId,
    totalWords,
    learnedWords,
    percentageLearned,
    quizzesTaken,
    averageQuizScore,
  });
});


export default router;
