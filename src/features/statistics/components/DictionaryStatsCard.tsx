import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import {
  statisticsApi,
  useGetDictionarySummaryQuery,
} from "../services/statisticsApi";
import Spinner from "../../../shared/components/Spinner";
import { useAppDispatch } from "../../../app/hooks";
import { useEffect } from "react";

type Props = {
  dictionaryId: string;
};

const COLORS = ["#10B981", "#9CA3AF"];

export default function DictionaryStatsCard({ dictionaryId }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      statisticsApi.util.invalidateTags([
        { type: "Statistics", id: dictionaryId },
      ])
    );
  }, [dispatch, dictionaryId]);

  const { data, isLoading, isError } =
    useGetDictionarySummaryQuery(dictionaryId);

  if (isLoading) return <Spinner message="Loading dictionary stats..." />;
  if (isError || !data)
    return <p className="text-red-500">Failed to load stats.</p>;

  const chartData = [
    { name: "Learned", value: data.learnedWords },
    { name: "Not Learned", value: data.totalWords - data.learnedWords },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 space-y-6 w-full max-w-md transition-all">
      <h3 className="text-xl font-bold text-title text-center">
        Vocabulary Progress
      </h3>

      <div className="flex justify-center">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={3}
              stroke="none"
              label={false}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  className="transition-all duration-200"
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{ fontSize: "0.75rem", borderRadius: "0.5rem" }}
              wrapperStyle={{ outline: "none" }}
            />
            <Legend
              formatter={(value) => `${value}`}
              wrapperStyle={{ fontSize: "0.75rem", marginTop: "1rem" }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-700">
        <Stat label="Total Words" value={data.totalWords} />
        <Stat label="Learned Words" value={data.learnedWords} />
        <Stat label="Progress" value={`${data.percentageLearned}%`} />
        <Stat label="Quizzes Taken" value={data.quizzesTaken} />
        <Stat label="Avg. Score" value={`${data.averageQuizScore}%`} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 shadow-sm text-center">
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-lg font-semibold text-title">{value}</p>
    </div>
  );
}
