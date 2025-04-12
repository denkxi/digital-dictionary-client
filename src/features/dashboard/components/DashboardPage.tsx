import { Link } from 'react-router-dom';
import MainLayout from '../../../shared/components/layouts/MainLayout';
import { useGetWordsQuery } from '../../vocabulary/services/vocabularyApi';

const DashboardPage = () => {
  // TODO: Implement authorization
  const userId = 'user-1';
  
  const { 
    data: words = [], 
    isLoading, 
    error 
  } = useGetWordsQuery(userId);
  
  const totalWords = words.length;
  const learnedWords = words.filter(word => word.learned).length;
  const learningProgress = totalWords > 0 ? Math.round((learnedWords / totalWords) * 100) : 0;

  
  // Get recently added words (last 5)
  const recentWords = [...words]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  // if (isLoading) {
  //   return (
  //     <MainLayout>
  //       <div className="flex justify-center items-center h-full p-8">
  //         Loading dashboard...
  //       </div>
  //     </MainLayout>
  //   );
  // }

  if (error) {
    return (
      <MainLayout>
        <div className="text-red-500 p-8">
          Error loading dashboard. Please try again later.
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Words</h2>
            <p className="text-3xl font-bold text-blue-600">{totalWords}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Words Learned</h2>
            <p className="text-3xl font-bold text-green-600">{learnedWords}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Learning Progress</h2>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${learningProgress}%` }}
                ></div>
              </div>
              <p className="mt-2 text-lg font-semibold text-gray-800">{learningProgress}%</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Recently Added Words</h2>
            <Link 
              to="/vocabulary" 
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
              View All →
            </Link>
          </div>
          
          {recentWords.length === 0 ? (
            <p className="text-gray-500">You haven't added any words yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentWords.map(word => (
                <div key={word.id} className="py-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{word.word}</p>
                      <p className="text-gray-600">{word.translation}</p>
                    </div>
                    {word.learned ? (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full h-fit">
                        Learned
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full h-fit">
                        Learning
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              to="/vocabulary" 
              className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg flex items-center"
            >
              <span className="text-2xl mr-3">📚</span>
              <div>
                <h3 className="font-medium text-gray-800">View Vocabulary</h3>
                <p className="text-sm text-gray-600">Browse and manage your words</p>
              </div>
            </Link>
            
            <Link 
              to="/categories" 
              className="bg-green-50 hover:bg-green-100 p-4 rounded-lg flex items-center"
            >
              <span className="text-2xl mr-3">🏷️</span>
              <div>
                <h3 className="font-medium text-gray-800">Categories</h3>
                <p className="text-sm text-gray-600">Organize words by categories</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;