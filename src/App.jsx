import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Categories from './pages/Categories';
import QuizSetup from './pages/QuizSetup';
import ActiveQuiz from './pages/ActiveQuiz';
import Results from './pages/Results';

function App() {
  return (
    <Router>
      <div className="min-h-screen app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/setup/:categoryId" element={<QuizSetup />} />
          <Route path="/quiz/:categoryId" element={<ActiveQuiz />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
