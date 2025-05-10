import { Link } from 'react-router-dom';
import { useGetCompletedQuizzesQuery } from '../services/quizApi';
import { getRelativeTimeString } from '../../../shared/utils/time';
import Spinner from '../../../shared/components/Spinner';

export default function CompletedQuizzes() {
  const { data: quizzes = [], isLoading, isError } = useGetCompletedQuizzesQuery();

  if (isLoading) return <Spinner message="Loading completed quizzes..." />;
  if (isError) return <p className="text-red-500">Failed to load quizzes.</p>;
  if (!quizzes.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-text">Completed Quizzes</h2>
      <ul className="space-y-2">
        {quizzes.map((quiz) => (
          <li key={quiz._id}>
            <Link
              to={`/quizzes/${quiz._id}/result`}
              className="block bg-accent-1 hover:bg-accent-2 p-4 rounded-xl shadow-sm transition"
            >
              <div className="font-medium text-title">{quiz.dictionaryName}</div>
              <div className="text-sm text-gray-700">
                Score: {quiz.result?.scorePercent ?? 0}% • Finished {getRelativeTimeString(quiz.completedAt?.toString() ?? '')}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
