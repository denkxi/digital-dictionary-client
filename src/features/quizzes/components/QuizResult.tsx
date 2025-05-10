import { useParams } from 'react-router-dom';
import { useGetQuizResultQuery } from '../services/quizApi';
import Spinner from '../../../shared/components/Spinner';
import { getQuestionPrompt } from '../utils/getQuestionPrompt';
import BackButton from '../../../shared/components/BackButton';

export default function QuizResult() {
  const { quizId } = useParams<{ quizId: string }>();

  const { data, isLoading, isError } = useGetQuizResultQuery(quizId!);

  if (isLoading) return <Spinner message="Loading quiz result..." />;
  if (isError || !data) return <p className="text-red-500">Failed to load result.</p>;

  const { quiz, questions } = data;

  return (
    <div className="space-y-6 max-w-2xl mx-auto mt-10 px-4">
      <BackButton />
      <h1 className="text-3xl font-bold text-title">Quiz Results</h1>

      <div className="bg-white border border-gray-200 rounded-xl shadow p-5 space-y-2">
        <p>
          <strong>Dictionary:</strong> {quiz.dictionaryName}
        </p>
        <p>
          <strong>Score:</strong>{" "}
          {quiz.result?.correctCount}/{quiz.result?.totalCount} (
          {quiz.result?.scorePercent}%)
        </p>
        <p>
          <strong>Completed at:</strong>{" "}
          {new Date(quiz.completedAt!).toLocaleString()}
        </p>
      </div>

      <div className="space-y-4">
        {questions.map((q) => (
          <div
            key={q._id}
            className={`p-4 rounded-xl border shadow-sm space-y-2 ${
              q.isCorrect
                ? "border-green-300 bg-green-50"
                : "border-red-300 bg-red-50"
            }`}
          >
            <p className="text-md font-medium text-title">
              {getQuestionPrompt(q)}
            </p>
            <p>
              <span className="text-gray-600">Your answer: </span>
              <strong>{q.userAnswer}</strong>
            </p>
            {!q.isCorrect && (
              <p className="text-sm text-gray-600">
                Correct answer:{" "}
                <strong className="text-black">{q.correctAnswer}</strong>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
