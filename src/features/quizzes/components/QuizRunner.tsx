import { useParams, useNavigate } from "react-router-dom";
import {
  useGetQuizByIdQuery,
  useSubmitQuizMutation,
} from "../services/quizApi";
import { useReducer } from "react";
import { initialQuizState, quizReducer } from "../services/quizReducer";
import Spinner from "../../../shared/components/Spinner";
import { getQuestionPrompt } from "../utils/getQuestionPrompt";

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

  if (isLoading) return <Spinner message="Loading quiz..." />;
  if (isError || !data) return <p className="text-red-500 text-center mt-6">Failed to load quiz</p>;

  const { quiz, questions } = data;
  const currentQuestion = questions[state.currentIndex];

  const handleAnswer = async (answer: string) => {
    const questionId = currentQuestion._id;

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
          quizId: quiz._id,
          answers: Object.entries(updatedAnswers).map(
            ([questionId, answer]) => ({
              questionId,
              answer,
            })
          ),
        }).unwrap();

        console.log("Submitted:", response);
        navigate(`/quizzes/${quiz._id}/result`);
      } catch (err) {
        alert("Failed to submit quiz");
      }
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto mt-10 px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-title">
          {quiz.dictionaryName} Quiz
        </h1>
        <span className="text-sm text-gray-500">
          {state.currentIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 space-y-5 transition">
        <p className="text-lg font-medium text-gray-800">
          {getQuestionPrompt(currentQuestion)}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQuestion.choices.map((choice) => (
            <button
              key={choice}
              onClick={() => handleAnswer(choice)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-left hover:bg-primary-1 transition-all duration-150 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-1 cursor-pointer"
            >
              {choice}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
