import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { statisticsApi, useGetDictionarySummaryQuery } from '../services/statisticsApi';
import Spinner from '../../../shared/components/Spinner';
import { useAppDispatch } from '../../../app/hooks';
import { useEffect } from 'react';

type Props = {
  dictionaryId: string;
};

const COLORS = ['#34D399', '#E5E7EB'];

export default function DictionaryStatsCard({ dictionaryId }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      statisticsApi.util.invalidateTags([
        { type: 'Statistics', id: dictionaryId },
      ])
    );
  }, [dispatch, dictionaryId]);

  const { data, isLoading, isError } = useGetDictionarySummaryQuery(dictionaryId);

  if (isLoading) return <Spinner message="Loading dictionary stats..." />;
  if (isError || !data) return <p className="text-red-500">Failed to load stats.</p>;

  const chartData = [
    { name: 'Learned', value: data.learnedWords },
    { name: 'Not Learned', value: data.totalWords - data.learnedWords },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-6 w-full max-w-md">

      <div className="flex justify-center">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={3}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        <Stat label="Total Words" value={data.totalWords} />
        <Stat label="Learned Words" value={data.learnedWords} />
        <Stat label="Learned %" value={`${data.percentageLearned}%`} />
        <Stat label="Quizzes Taken" value={data.quizzesTaken} />
        <Stat label="Avg. Quiz Score" value={`${data.averageQuizScore}%`} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-gray-50 p-3 rounded border border-gray-200">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-base font-semibold text-title">{value}</p>
    </div>
  );
}
