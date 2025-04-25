import { Link } from 'react-router-dom';
import { useGetUnfinishedQuizzesQuery } from '../services/quizApi';

export default function UnfinishedQuizzes() {
  const { data: quizzes = [], isLoading, isError } = useGetUnfinishedQuizzesQuery();

  if (isLoading) return <p>Loading unfinished quizzes...</p>;
  if (isError) return <p className="text-red-500">Failed to load quizzes.</p>;
  if (!quizzes.length) return null; // Hide if none

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-text">Unfinished Quizzes</h2>
      <ul className="space-y-2">
        {quizzes.map((quiz) => (
          <li key={quiz.id}>
            <Link
              to={`/quizzes/${quiz.id}`}
              className="block bg-primary-1 hover:bg-primary-2 p-3 rounded shadow-sm"
            >
              {quiz.dictionaryName} - {quiz.wordCount} words
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
