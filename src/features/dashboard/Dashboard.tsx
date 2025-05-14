import { useAppSelector } from "../../app/hooks";
import { useGetAllDictionariesQuery } from "../dictionaries/services/dictionaryApi";
import DictionaryCard from "../dictionaries/components/DictionaryCard";
import UserStatsCard from "../statistics/components/UserStatsCard";
import HowToUseSection from "./HowToUseSection";
import Button from "../../shared/components/Button";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const { data: dictionaries = [] } = useGetAllDictionariesQuery();

  const recentDictionaries = [...dictionaries]
    .filter((d) => d.updatedAt)
    .sort(
      (a, b) =>
        new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime()
    )
    .slice(0, 4);

    if (!user) {
      return (
        <div className="max-w-xl mx-auto text-center py-16 space-y-6 px-4">
          <h1 className="text-4xl font-bold text-title">Welcome to Digital Dictionary</h1>
          <p className="text-gray-600 text-base">
            Sign in to create and manage your vocabulary dictionaries, take quizzes, and track your progress.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="primary" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          </div>
        </div>
      );
    }
    

  return (
    <div className="max-w-6xl mx-auto space-y-12 px-4 pt-8 sm:pt-12">
      {/* Greeting */}
      <header>
        <h1 className="text-4xl font-bold text-title mb-1">
          Welcome{user ? `, ${user.name}` : " to Digital Dictionary"}
        </h1>
        <p className="text-gray-600 text-base">
          Your space to build, organize, and master vocabulary.
        </p>
      </header>

      {/* How to Use Section */}
      <HowToUseSection />

      {/* Recently Used Dictionaries */}
      {recentDictionaries.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-title mb-4">
            Recently Used Dictionaries
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
            {recentDictionaries.map((dict) => (
              <div key={dict.id} className="flex-shrink-0 w-[300px]">
                <DictionaryCard
                  dictionary={dict}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* User Statistics */}
      <section>
        <h2 className="text-2xl font-semibold text-title mb-4">
          Your Learning Stats
        </h2>
        <div className="bg-white border border-gray-200 rounded-3xl shadow p-6 sm:p-8">
          <UserStatsCard />
        </div>
      </section>
    </div>
  );
}
