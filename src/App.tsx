import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./features/dashboard/components/DashboardPage";
import VocabularyPage from "./features/vocabulary/components/VocabularyPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/vocabulary" element={<VocabularyPage />} />
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
