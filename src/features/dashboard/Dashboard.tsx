import { Link } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';

export default function Dashboard() {
  const user = useAppSelector(state => state.auth.user);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-text">Welcome {user ? user.name : 'to Digital Dictionary'}</h1>

      <p className="text-gray-700 leading-relaxed">
        This app helps you build your own vocabulary lists, organize them by category,
        track learned words, and test yourself with quizzes.
      </p>

      <div className="border-l-4 border-primary-2 pl-4">
          <h2 className="text-xl font-semibold text-text">How to use:</h2>
          <ul className="list-disc list-inside text-sm mt-2 text-gray-700 space-y-1">
            <li>Create categories to organize your vocabulary thematically.</li>
            <li>Create dictionaries for the languages you're learning.</li>
            <li>Add words to your dictionaries and track progress.</li>
            <li>Mark words as starred (important) or learned.</li>
          </ul>
        </div>

      {user ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <Link
            to="/word-categories"
            className="block bg-primary-2 hover:bg-primary-1 text-center py-3 rounded shadow-sm font-medium"
          >
            View Categories
          </Link>
          <Link
            to="/dictionaries"
            className="block bg-primary-2 hover:bg-primary-1 text-center py-3 rounded shadow-sm font-medium"
          >
            View Dictionaries
          </Link>
          <Link
            to="/tests"
            className="block bg-primary-2 hover:bg-primary-1 text-center py-3 rounded shadow-sm font-medium"
          >
            Complete Tests
          </Link>
        </div>
      ) : (
        <div className="mt-6">
          <Link
            to="/auth"
            className="block bg-primary-2 hover:bg-primary-1 text-center py-3 rounded shadow-sm font-medium"
          >
            Sign In to Get Started
          </Link>
        </div>
      )}
    </div>
  );
}
