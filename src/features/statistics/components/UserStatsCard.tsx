import { useGetUserSummaryQuery } from '../services/statisticsApi';
import { useGetWordsByIdsQuery } from '../../words/services/wordApi';
import Spinner from '../../../shared/components/Spinner';
import { Link } from 'react-router-dom';
import {
    FiList,
    FiCheckCircle,
    FiTrendingUp,
    FiAlertCircle,
  } from 'react-icons/fi';

export default function UserStatsCard() {
  const { data: summary, isLoading, isError } = useGetUserSummaryQuery();

  const {
    data: missedWords,
    isLoading: isLoadingWords,
    isError: isErrorWords,
  } = useGetWordsByIdsQuery(summary?.mostMissedWordIds ?? [], {
    skip: !summary?.mostMissedWordIds?.length,
  });

  if (isLoading) return <Spinner message="Loading user statistics..." />;
  if (isError || !summary)
    return <p className="text-red-500">Failed to load user statistics.</p>;

  return (
    <div className="bg-white border border-gray-200 rounded-3xl shadow-lg p-6 sm:p-8 space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-title mb-2">Your Quiz Stats</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center text-sm text-gray-700">
        <StatBlock label="Total Quizzes" value={summary.totalQuizzes} Icon={FiList} />
        <StatBlock label="Perfect Scores" value={summary.perfectScores} Icon={FiCheckCircle} />
        <StatBlock label="Avg. Score" value={`${summary.averageScorePercent}%`} Icon={FiTrendingUp} />
        <StatBlock label="Total Mistakes" value={summary.totalMistakes} Icon={FiAlertCircle} />
      </div>

      <hr className="border-t border-gray-200" />

      {isLoadingWords && <Spinner message="Loading missed words..." />}
      {!isLoadingWords && missedWords && missedWords.length > 0 && (
        <div className="space-y-2">
          <p className="text-gray-600 font-medium">Most Missed Words:</p>
          <ul className="space-y-1">
            {missedWords.map((word) => (
              <li key={word.id}>
                <Link
                  to={`/dictionaries/${word.dictionaryId}`}
                  className="text-base font-medium text-blue-700 hover:text-blue-900 hover:underline transition"
                >
                  {word.writing}
                  {word.translation && (
                    <span className="text-gray-600"> ({word.translation})</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isErrorWords && (
        <p className="text-red-500 text-sm">Failed to load missed words.</p>
      )}
    </div>
  );
}

function StatBlock({
    label,
    value,
    Icon,
  }: {
    label: string;
    value: string | number;
    Icon: React.ElementType;
  }) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2 text-left sm:text-center">
        <Icon className="text-2xl text-gray-700 shrink-0" />
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
          <p className="text-xl font-semibold text-title">{value}</p>
        </div>
      </div>
    );
  }
  
