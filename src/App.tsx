import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './shared/components/Layout';
import WordCategoryList from './features/wordCategories/components/WordCategoryList';
import DictionariesList from './features/dictionaries/DictionariesList';
import WordList from './features/words/WordList';
import Dashboard from './features/dashboard/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/dictionaries" element={<DictionariesList />} />
          <Route path="/dictionaries/:dictionaryId" element={<WordList />} />
          <Route path="/word-categories" element={<WordCategoryList />} />
          <Route path="/tests" element={<div>Tests</div>} />
          <Route path="/profile" element={<div>Profile</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
