import NewQuizCard from './NewQuizCard';

export default function QuizPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-text">Quiz Dashboard</h1>

      <NewQuizCard />

      {/* Future sections */}
      {/* <UnfinishedQuizzes /> */}
      {/* <QuizHistoryPreview /> */}
    </div>
  );
}
