import { Link } from 'react-router-dom';
import { useGetUnfinishedQuizzesQuery } from '../services/quizApi';
import { getRelativeTimeString } from '../../../shared/utils/time';
import Spinner from '../../../shared/components/Spinner';

export default function UnfinishedQuizzes() {
  const { data: quizzes = [], isLoading, isError } = useGetUnfinishedQuizzesQuery();

  if (isLoading) return <Spinner message="Loading unfinished quizzes..." />;
  if (isError) return <p className="text-red-500">Failed to load quizzes.</p>;
  if (!quizzes.length) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-text">Unfinished Quizzes</h2>
      <ul className="space-y-2">
        {quizzes.map((quiz) => (
          <li key={quiz.id}>
            <Link
              to={`/quizzes/${quiz.id}`}
              className="block bg-primary-1 hover:bg-primary-2 p-4 rounded-xl shadow-sm transition"
            >
              <div className="font-medium text-title">{quiz.dictionaryName}</div>
              <div className="text-sm text-gray-700">
                {quiz.wordCount} words • Created {getRelativeTimeString(quiz.createdAt)}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
