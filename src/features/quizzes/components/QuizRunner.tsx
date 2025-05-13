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
    <div className="max-w-3xl mx-auto mt-10 px-4 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-title">
          {quiz.dictionaryName} Quiz
        </h1>
        <div className="text-sm sm:text-base font-medium text-muted-foreground bg-gray-100 px-3 py-1 rounded-full shadow-sm">
          {state.currentIndex + 1} / {questions.length}
        </div>
      </div>
  
      {/* Question Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-8 transition space-y-6">
        {/* Prompt */}
        <div className="text-lg sm:text-xl font-semibold text-title tracking-tight">
          {getQuestionPrompt(currentQuestion)}
        </div>
  
        {/* Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentQuestion.choices.map((choice) => (
            <button
              key={choice}
              onClick={() => handleAnswer(choice)}
              className="cursor-pointer border border-gray-300 rounded-xl px-4 py-3 text-left text-sm sm:text-base text-text bg-white hover:bg-primary-1/10 hover:border-primary-1 transition-all duration-150 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-1"
            >
              {choice}
            </button>
          ))}
        </div>
  
        {/* Progress bar */}
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-2/90 to-primary-2 rounded-full transition-all duration-300"
            style={{
              width: `${((state.currentIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
  
  
}
