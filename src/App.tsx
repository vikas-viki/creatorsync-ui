import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useThemeStore } from './stores/themeStore';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';
import { useEffect } from 'react';

function App() {
  const { isDarkMode } = useThemeStore();
  const location = useLocation();
  const { session, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const getSession = async () => {
    const res = await session();
    if (res && location.pathname != "/") {
      await navigate('/dashboard');
    }
  }

  useEffect(() => {
    getSession();
  }, []);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
        <Toaster position='bottom-right' />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
              <AuthPage />
            </GoogleOAuthProvider>
          } />
          <Route path="/dashboard" element={isAuthenticated ?
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
              <DashboardPage />
            </GoogleOAuthProvider>
            : <Navigate to="/auth" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;