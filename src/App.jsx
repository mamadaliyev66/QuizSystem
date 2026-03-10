import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useQuizStore from './store/useQuizStore';
import Login from './pages/Login';
import Categories from './pages/Categories';
import QuizSetup from './pages/QuizSetup';
import ActiveQuiz from './pages/ActiveQuiz';
import Results from './pages/Results';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const user = useQuizStore((state) => state.user);
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
          <Route path="/setup/:categoryId" element={<ProtectedRoute><QuizSetup /></ProtectedRoute>} />
          <Route path="/quiz/:categoryId" element={<ProtectedRoute><ActiveQuiz /></ProtectedRoute>} />
          <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
