import { useParams } from 'react-router-dom';
import { useGetQuizResultQuery } from '../services/quizApi';

export default function QuizResult() {
  const { quizId } = useParams<{ quizId: string }>();

  const { data, isLoading, isError } = useGetQuizResultQuery(quizId!);

  if (isLoading) return <p>Loading quiz result...</p>;
  if (isError || !data) return <p className="text-red-500">Failed to load result.</p>;

  const { quiz, questions } = data;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-text">Quiz Results</h1>

      <div className="bg-white p-4 rounded shadow">
        <p><strong>Dictionary:</strong> {quiz.dictionaryName}</p>
        <p><strong>Score:</strong> {quiz.result?.correctCount}/{quiz.result?.totalCount} ({quiz.result?.scorePercent}%)</p>
        <p><strong>Completed at:</strong> {new Date(quiz.completedAt!).toLocaleString()}</p>
      </div>

      <div className="space-y-4">
        {questions.map((q) => (
          <div
            key={q.id}
            className={`p-4 rounded border ${
              q.isCorrect ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'
            }`}
          >
            <p className="font-medium">{q.prompt}</p>
            <p>Your answer: <strong>{q.userAnswer}</strong></p>
            {!q.isCorrect && (
              <p className="text-sm text-gray-600">
                Correct answer: <strong>{q.correctAnswer}</strong>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
