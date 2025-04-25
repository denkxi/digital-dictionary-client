export type QuizState = {
  currentIndex: number;
  answers: Record<string, string>;
};

export type QuizAction =
  | { type: "ANSWER"; questionId: string; answer: string }
  | { type: "NEXT_QUESTION" }
  | { type: "RESET" };

export const initialQuizState: QuizState = {
  currentIndex: 0,
  answers: {},
};

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "ANSWER":
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.questionId]: action.answer,
        },
      };
    case "NEXT_QUESTION":
      return {
        ...state,
        currentIndex: state.currentIndex + 1,
      };
    case "RESET":
      return initialQuizState;
    default:
      return state;
  }
}
