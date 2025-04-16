import express from 'express';
import { authenticate } from '../utils/authMiddleware.ts';
import { readJSON, writeJSON } from '../utils/db.ts';
import { Quiz, Question, Word, QuestionType } from '../types.ts';

const router = express.Router();

const MIN_WORDS = 2; // todo: move to shared constants

router.post('/quizzes', authenticate, async (req, res) => {
  const userId = (req as any).userId;
  const { dictionaryId, questionType, wordCount } = req.body;

  if (!dictionaryId || !questionType || !wordCount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const words = await readJSON<Word[]>('words.json');
  const eligibleWords = words.filter(w => w.dictionaryId === dictionaryId);

  if (eligibleWords.length < MIN_WORDS) {
    return res.status(400).json({ error: `Dictionary must have at least ${MIN_WORDS} words` });
  }

  const selectedWords = eligibleWords
    .sort(() => 0.5 - Math.random())
    .slice(0, wordCount);

  const quizzes = await readJSON<Quiz[]>('quizzes.json');
  const questions = await readJSON<Question[]>('questions.json');

  const newQuizId = (quizzes.at(-1)?.id ?? 0) + 1;
  const createdAt = new Date().toISOString();

  const newQuiz: Quiz = {
    id: newQuizId,
    userId,
    dictionaryId,
    questionType,
    wordCount: selectedWords.length,
    createdAt
  };

  const generatedQuestions: Question[] = selectedWords.map((word, i) => {
    const actualType =
      questionType === 'mixed'
        ? randomQuestionType()
        : questionType;

    const correctAnswer = getAnswerForType(word, actualType);
    const choices = generateChoices(correctAnswer, eligibleWords, actualType);

    return {
      id: (questions.at(-1)?.id ?? 0) + 1 + i,
      quizId: newQuizId,
      wordId: word.id,
      type: actualType,
      prompt: getPromptForType(word, actualType),
      correctAnswer,
      choices
    };
  });

  quizzes.push(newQuiz);
  questions.push(...generatedQuestions);

  await writeJSON('quizzes.json', quizzes);
  await writeJSON('questions.json', questions);

  res.status(201).json({ quiz: newQuiz, questions: generatedQuestions });
});

// Helpers
function randomQuestionType(): QuestionType {
  const types = [
    QuestionType.Translation,
    QuestionType.Writing,
    QuestionType.Pronunciation
  ];
  return types[Math.floor(Math.random() * types.length)];
}

function getAnswerForType(word: Word, type: QuestionType): string {
  switch (type) {
    case QuestionType.Translation:
      return word.translation;
    case QuestionType.Writing:
      return word.writing;
    case QuestionType.Pronunciation:
      return word.pronunciation || '';
    default:
      return '';
  }
}

function getPromptForType(word: Word, type: QuestionType): string {
  switch (type) {
    case QuestionType.Translation:
      return word.writing;
    case QuestionType.Writing:
      return word.translation;
    case QuestionType.Pronunciation:
      return word.translation;
    default:
      return '';
  }
}

function generateChoices(correct: string, allWords: Word[], type: QuestionType): string[] {
  const pool = allWords
    .map(w => getAnswerForType(w, type))
    .filter(a => a && a !== correct);

  const distractors = [...new Set(pool)]
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  const choices = [...distractors, correct].sort(() => 0.5 - Math.random());
  return choices;
}

export default router;
