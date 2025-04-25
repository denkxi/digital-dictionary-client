import CompletedQuizzes from './CompletedQuizzes';
import NewQuizCard from './NewQuizCard';
import UnfinishedQuizzes from './UnfinishedQuizzes';

export default function QuizPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-text">Quiz Dashboard</h1>

      <NewQuizCard />

      <UnfinishedQuizzes />
      <CompletedQuizzes />
    </div>
  );
}
