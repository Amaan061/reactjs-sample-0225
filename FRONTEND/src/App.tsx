import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './styles/theme.css';

// Components
import AuthForm from './components/auth/AuthForm';
import Dashboard from './components/dashboard/Dashboard';

// Context
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { ThemeProvider } from './context/ThemeContext';

// Routes
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              style={{ zIndex: 9999 }}
            />
            <Routes>
            {/* Public routes */}
            <Route path="/login" element={<AuthForm initialMode="login" />} />
            <Route path="/signup" element={<AuthForm initialMode="signup" />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={
                <TaskProvider>
                  <Dashboard />
                </TaskProvider>
              } />
              {/* Add more protected routes here */}
            </Route>
            
            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
