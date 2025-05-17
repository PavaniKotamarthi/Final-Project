import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import PostsPage from './pages/PostsPage';
import QuestionsPage from './pages/QuestionsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Dashboard Route with Nested Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<PostsPage />} />
          <Route path="questions" element={<QuestionsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
