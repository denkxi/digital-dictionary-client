import { useParams, useNavigate } from "react-router-dom";
import {
  useGetQuizByIdQuery,
  useSubmitQuizMutation,
} from "../services/quizApi";
import { useReducer } from "react";
import { initialQuizState, quizReducer } from "../services/quizReducer";

export default function QuizRunner() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  // todo: proper error handling
  if (!quizId) {
    navigate("/quizzes");
    return null;
  }

  const { data, isLoading, isError } = useGetQuizByIdQuery(quizId);
  const [submitQuiz] = useSubmitQuizMutation();

  const [state, dispatch] = useReducer(quizReducer, initialQuizState);

  if (isLoading) return <p>Loading quiz...</p>; // todo: use proper loader with spinner
  if (isError || !data)
    return <p className="text-red-500">Failed to load quiz</p>;

  const { quiz, questions } = data;
  const currentQuestion = questions[state.currentIndex];

  const handleAnswer = async (answer: string) => {
    const questionId = currentQuestion.id;

    const updatedAnswers = {
      ...state.answers,
      [questionId]: answer,
    };

    dispatch({ type: "ANSWER", questionId, answer });

    const isLast = state.currentIndex === questions.length - 1;

    if (!isLast) {
      dispatch({ type: "NEXT_QUESTION" });
    } else {
      try {
        const response = await submitQuiz({
          quizId: quiz.id,
          answers: Object.entries(updatedAnswers).map(
            ([questionId, answer]) => ({
              questionId,
              answer,
            })
          ),
        }).unwrap();

        console.log("Submitted:", response);
        navigate(`/quizzes/${quiz.id}/result`);
      } catch (err) {
        alert("Failed to submit quiz");
      }
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold text-text">
        {quiz.dictionaryName} Quiz
      </h1>
      <p className="text-sm text-gray-600">
        Question {state.currentIndex + 1} of {questions.length}
      </p>

      <div className="bg-white p-4 rounded shadow space-y-4">
        <p className="text-lg font-medium">{currentQuestion.prompt}</p>
        <div className="grid grid-cols-1 gap-2">
          {currentQuestion.choices.map((choice) => (
            <button
              key={choice}
              onClick={() => handleAnswer(choice)}
              className="border px-4 py-2 rounded hover:bg-primary-1 text-left"
            >
              {choice}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
