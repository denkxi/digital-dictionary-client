import { Link } from 'react-router-dom';
import { useGetCompletedQuizzesQuery } from '../services/quizApi';

export default function CompletedQuizzes() {
  const { data: quizzes = [], isLoading, isError } = useGetCompletedQuizzesQuery();

  if (isLoading) return <p>Loading completed quizzes...</p>;
  if (isError) return <p className="text-red-500">Failed to load quizzes.</p>;
  if (!quizzes.length) return null; // Hide if none

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-text">Completed Quizzes</h2>
      <ul className="space-y-2">
        {quizzes.map((quiz) => (
          <li key={quiz.id}>
            <Link
              to={`/quizzes/${quiz.id}/result`}
              className="block bg-accent-1 hover:bg-accent-2 p-3 rounded shadow-sm"
            >
              {quiz.dictionaryName} - Score: {quiz.result?.scorePercent ?? 0}%
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
