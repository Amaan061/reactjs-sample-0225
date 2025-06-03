import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService from '../services/authService';
import { notify } from '../utils/toast';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null); // User details object
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = () => {
      setLoading(true);
      try {
        const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          const storedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (err) {
        console.error('Failed to initialize auth state:', err);
        // Clear potentially corrupted storage
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('currentUser');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    setLoading(true);
    setError(null);
    try {
      console.log('AuthContext: Attempting login for email:', email);
      const authResponse = await authService.login(email, password, rememberMe);
      console.log('AuthContext: Login response:', authResponse);
      
      if (authResponse.token) {
        setToken(authResponse.token);
        
        // Extract user data from response
        const userData = authResponse.data || authResponse.user;
        console.log('AuthContext: User data from response:', userData);
        
        if (userData) {
          // Store user data
          const userToStore = JSON.stringify(userData);
          if (rememberMe) {
            localStorage.setItem('currentUser', userToStore);
          } else {
            sessionStorage.setItem('currentUser', userToStore);
          }
          
          // Update user state
          setUser(userData);
          console.log('AuthContext: User state updated:', userData);
          
          // Show welcome notification
          notify.success(`Welcome back, ${userData.username || userData.email}!`);
        } else {
          console.warn('AuthContext: No user data in login response');
          setUser(null);
        }
      } else {
        console.warn('AuthContext: No token in login response');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to login';
      console.error('AuthContext: Login error:', errorMessage);
      setError(errorMessage);
      notify.error(`Login failed: ${errorMessage}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('AuthContext: Attempting registration for user:', username);
      const authResponse = await authService.register(username, email, password);
      console.log('AuthContext: Registration response:', authResponse);
      if (authResponse.token) {
        setToken(authResponse.token);
        const userData = authResponse.data || authResponse.user;
        if (userData) {
          const userToStore = JSON.stringify(userData);
          sessionStorage.setItem('currentUser', userToStore);
          setUser(userData);
          notify.success(`Welcome, ${userData.username || userData.email}! Your account is created.`);
        } else {
          setUser(null);
        }
      } else {
        notify.info('Registration successful! Please login with your new account.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register';
      setError(errorMessage);
      notify.error(`Registration failed: ${errorMessage}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout(); // Clears token from storage
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    setUser(null);
    setToken(null);
    notify.info('You have been signed out successfully');
  };

  const value = {
    isAuthenticated: !!token,
    user,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
