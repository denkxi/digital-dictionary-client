import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './shared/components/Layout';
import WordCategoryList from './features/wordCategories/components/WordCategoryList';
import DictionariesList from './features/dictionaries/DictionariesList';
import WordList from './features/words/WordList';
import Dashboard from './features/dashboard/Dashboard';
import AuthPage from './features/auth/AuthPage';
import PrivateRoute from './shared/components/PrivateRoute';

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
          <Route path="/tests" element={<div>Tests</div>} />
          <Route path="/profile" element={<div>Profile</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
