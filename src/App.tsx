import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./shared/components/shared/Sidebar";
import DashboardPage from "./features/dashboard/components/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        {/* <Route path="/vocabulary" element={<VocabularyPage />} /> */}
        {/* Add more routes as you develop them */}
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
