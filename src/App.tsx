import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './shared/components/Layout';
import WordCategoryList from './features/wordCategories/components/WordCategoryList';
import DictionariesList from './features/dictionaries/components/DictionariesList';
import WordList from './features/words/components/WordList';
import Dashboard from './features/dashboard/Dashboard';
import AuthPage from './features/auth/AuthPage';
import PrivateRoute from './shared/components/PrivateRoute';
import QuizPage from './features/quizzes/components/QuizPage';
import QuizRunner from './features/quizzes/components/QuizRunner';
import QuizResult from './features/quizzes/components/QuizResult';
import Profile from './features/profile/components/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dictionaries" element={<PrivateRoute><DictionariesList /></PrivateRoute>} />
          <Route path="/dictionaries/:dictionaryId" element={<PrivateRoute><WordList /></PrivateRoute>} />
          <Route path="/word-categories" element={<PrivateRoute><WordCategoryList /></PrivateRoute>} />
          <Route path="/quizzes" element={<PrivateRoute><QuizPage /></PrivateRoute>} />
          <Route path="/quizzes/:quizId" element={<PrivateRoute><QuizRunner /></PrivateRoute>} />
          <Route path="/quizzes/:quizId/result" element={<PrivateRoute><QuizResult /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
