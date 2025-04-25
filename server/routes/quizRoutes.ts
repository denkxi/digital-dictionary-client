import express from "express";
import { authenticate } from "../utils/authMiddleware.ts";
import { readJSON, writeJSON } from "../utils/db.ts";
import {
  Quiz,
  Question,
  Word,
  QuestionType,
  UserDictionary,
  Dictionary,
} from "../types.ts";
import { v4 as uuid } from "uuid";

const router = express.Router();

// todo: if quiz type is one certain type, then count and use only words that only have that type (for exampleif question type is pronunciation, then only use words that have a pronunciation)
const MIN_WORDS = 2; // todo: move to shared constants

type QuizSubmission = {
  answers: {
    questionId: string;
    answer: string;
  }[];
};

// Create a new quiz
router.post("/", authenticate, async (req, res) => {
  const userId = (req as any).userId;
  const { dictionaryId, questionType, wordCount } = req.body;
  if (!dictionaryId || !questionType || !wordCount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Check if user owns the dictionary
  const userDictionaries = await readJSON<UserDictionary[]>(
    "userDictionaries.json"
  );
  const hasAccess = userDictionaries.some(
    (ud) => ud.userId === userId && ud.dictionaryId === dictionaryId
  );
  if (!hasAccess) {
    return res
      .status(403)
      .json({ error: "You do not have access to this dictionary" });
  }

  const words = await readJSON<Word[]>("words.json");
  const eligibleWords = words.filter((w) => w.dictionaryId === dictionaryId);

  if (eligibleWords.length < MIN_WORDS) {
    return res
      .status(400)
      .json({ error: `Dictionary must have at least ${MIN_WORDS} words` });
  }

  const selectedWords = eligibleWords
    .sort(() => 0.5 - Math.random())
    .slice(0, wordCount);

  const quizzes = await readJSON<Quiz[]>("quizzes.json");
  const questions = await readJSON<Question[]>("questions.json");

  const newQuizId = uuid();
  const createdAt = new Date().toISOString();

  const newQuiz: Quiz = {
    id: newQuizId,
    userId,
    dictionaryId,
    questionType,
    wordCount: selectedWords.length,
    createdAt,
  };

  const generatedQuestions: Question[] = selectedWords.map((word) => {
    let actualType: QuestionType =
      questionType === QuestionType.Mixed ? randomQuestionType() : questionType;

    let correctAnswer = getAnswerForType(word, actualType);

    // fallback to another type if correctAnswer is missing
    if (!correctAnswer) {
      const fallbackTypes = [
        QuestionType.Translation,
        QuestionType.Writing,
      ].sort(() => 0.5 - Math.random());
      for (const fallbackType of fallbackTypes) {
        const alternativeAnswer = getAnswerForType(word, fallbackType);
        if (alternativeAnswer) {
          actualType = fallbackType;
          correctAnswer = alternativeAnswer;
          break;
        }
      }
    }

    const choices = generateChoices(correctAnswer, eligibleWords, actualType);

    return {
      id: uuid(),
      quizId: newQuizId,
      wordId: word.id,
      type: actualType,
      prompt: getPromptForType(word, actualType),
      correctAnswer,
      choices,
    };
  });

  quizzes.push(newQuiz);
  questions.push(...generatedQuestions);

  await writeJSON("quizzes.json", quizzes);
  await writeJSON("questions.json", questions);

  res.status(201).json({ quiz: newQuiz, questions: generatedQuestions });
});

// Helpers
function randomQuestionType(): QuestionType {
  const types = [
    QuestionType.Translation,
    QuestionType.Writing,
    QuestionType.Pronunciation,
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
      return word.pronunciation || "";
    default:
      return "";
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
      return "";
  }
}

function generateChoices(
  correct: string,
  allWords: Word[],
  type: QuestionType
): string[] {
  const pool = allWords
    .map((w) => getAnswerForType(w, type))
    .filter((a) => a && a !== correct);

  const distractors = [...new Set(pool)]
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  const choices = [...distractors, correct].sort(() => 0.5 - Math.random());
  return choices;
}

// Get all quizzes for a user
router.get("/", authenticate, async (req, res) => {
  const userId = (req as any).userId;
  const quizzes = await readJSON<Quiz[]>("quizzes.json");

  const userQuizzes = quizzes
    .filter((q) => q.userId === userId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  res.json(userQuizzes);
});

// Get a quiz by ID
router.get("/:quizId", authenticate, async (req, res) => {
  const userId = (req as any).userId;
  const quizId = req.params.quizId;

  const quizzes = await readJSON<Quiz[]>("quizzes.json");
  const questions = await readJSON<Question[]>("questions.json");
  const dictionaries = await readJSON<Dictionary[]>("dictionaries.json");

  const quiz = quizzes.find((q) => q.id === quizId && q.userId === userId);

  if (!quiz) {
    return res.status(404).json({ error: "Quiz not found" });
  }

  if (quiz.completedAt) {
    return res.status(400).json({ error: "Quiz already completed" });
  }

  const dictionary = dictionaries.find((d) => d.id === quiz.dictionaryId);
  if (!dictionary) {
    return res.status(404).json({ error: "Dictionary not found" });
  }

  const quizQuestions = questions.filter((q) => q.quizId === quizId);

  res.json({
    quiz: {
      ...quiz,
      dictionaryName: dictionary.name,
    },
    questions: quizQuestions,
  });
});

// Submit quiz answers
router.post("/:quizId/submit", authenticate, async (req, res) => {
  const userId = (req as any).userId;
  const quizId = req.params.quizId;
  const { answers } = req.body;

  if (!Array.isArray(answers) || answers.length === 0) {
    // todo: instead of checking if length is not 0, check if amount of answers is the same as quiz.wordCount
    return res.status(400).json({
      error: "No answers provided or not all the questions were answered",
    });
  }

  const quizzes = await readJSON<Quiz[]>("quizzes.json");
  const questions = await readJSON<Question[]>("questions.json");

  const quiz = quizzes.find((q) => q.id === quizId && q.userId === userId);
  if (!quiz) {
    return res.status(404).json({ error: "Quiz not found" });
  }
  if (quiz.completedAt) {
    return res.status(400).json({ error: "Quiz has already been submitted" });
  }

  const quizQuestions = questions.filter((q) => q.quizId === quizId);

  let correct = 0;

  const updatedQuestions = quizQuestions.map((question) => {
    const userAnswer = answers.find(
      (answer) => answer.questionId === question.id
    )?.answer;
    const isCorrect = userAnswer === question.correctAnswer;

    if (isCorrect) correct++;

    return {
      ...question,
      userAnswer,
      isCorrect,
    };
  });

  const updatedQuiz: Quiz = {
    ...quiz,
    completedAt: new Date().toISOString(),
    result: {
      correctCount: correct,
      incorrectCount: quizQuestions.length - correct,
      totalCount: quizQuestions.length,
      scorePercent: Math.round((correct / quizQuestions.length) * 100),
    },
  };

  // Save updates
  const updatedQuizzes = quizzes.map((q) =>
    q.id === quiz.id ? updatedQuiz : q
  );
  const finalQuestions = questions.map((q) =>
    q.quizId === quizId ? updatedQuestions.find((uq) => uq.id === q.id)! : q
  );

  await writeJSON("quizzes.json", updatedQuizzes);
  await writeJSON("questions.json", finalQuestions);

  res.json({
    result: updatedQuiz.result,
    questions: updatedQuestions,
  });
});

// Get quiz result
router.get("/:quizId/result", authenticate, async (req, res) => {
  const userId = (req as any).userId;
  const quizId = req.params.quizId;

  const quizzes = await readJSON<Quiz[]>("quizzes.json");
  const questions = await readJSON<Question[]>("questions.json");

  const quiz = quizzes.find((q) => q.id === quizId && q.userId === userId);

  if (!quiz) {
    return res.status(404).json({ error: "Quiz not found" });
  }

  if (!quiz.completedAt || !quiz.result) {
    return res.status(400).json({ error: "Quiz not yet completed" });
  }

  const quizQuestions = questions.filter((q) => q.quizId === quizId);

  res.json({
    quiz,
    questions: quizQuestions,
  });
});

export default router;
