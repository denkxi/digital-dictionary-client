import { Question, QuestionType } from "../types/quizTypes";

export function getQuestionPrompt(question: Question): string {
  switch (question.type) {
    case QuestionType.Translation:
      return `Choose the correct translation for "${question.prompt}"`;
    case QuestionType.Writing:
      return `Select the correct spelling for "${question.prompt}"`;
    case QuestionType.Pronunciation:
      return `Choose the correct pronunciation for "${question.prompt}"`;
    default:
      return "Select the correct answer:";
  }
}
