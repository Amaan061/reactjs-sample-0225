import api from './api';

// Type definition for axios error responses
interface AxiosErrorResponse {
  response?: {
    status: number;
    data: any;
  };
  message?: string;
}

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    // Handle authentication errors
    const axiosError = error as AxiosErrorResponse;
    if (axiosError.response && axiosError.response.status === 401) {
      // Clear stored tokens and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Type definitions for API responses
interface AuthResponse {
  token: string;
  success?: boolean;
  // Backend response includes user info in 'data' field
  data?: {
    _id: string;
    username: string;
    email: string;
    profileImage?: string;
    createdAt?: string;
    __v?: number;
  };
  // Keep backward compatibility
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

// Authentication service functions
export const authService = {
  login: async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      console.log('authService: Attempting login for:', email);
      const response = await api.post<AuthResponse>('/auth/login', { email, password });
      console.log('authService: Raw login response:', response.data);
      
      // Store token based on remember me setting
      if (response.data.token) {
        console.log('authService: Storing token, rememberMe:', rememberMe);
        if (rememberMe) {
          localStorage.setItem('token', response.data.token);
        } else {
          sessionStorage.setItem('token', response.data.token);
        }
        
        // If we have data but no user field, format it for compatibility
        if (response.data.data && !response.data.user) {
          const userData = response.data.data;
          console.log('authService: Processing user data from response.data.data:', userData);
          
          // Convert backend user format to frontend expected format if needed
          if (!response.data.user) {
            response.data.user = {
              id: userData._id,
              username: userData.username,
              email: userData.email
            };
            console.log('authService: Created user field from data:', response.data.user);
          }
        }
      }
      
      return response.data;
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as AxiosErrorResponse;
        if (axiosError.response?.data?.message) {
          throw new Error(axiosError.response.data.message);
        }
      }
      throw new Error('Login failed');
    }
  },
  
  register: async (username: string, email: string, password: string) => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', { username, email, password });
      return response.data;
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as AxiosErrorResponse;
        if (axiosError.response?.data?.message) {
          throw new Error(axiosError.response.data.message);
        }
      }
      throw new Error('Registration failed');
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  },
  
  getCurrentUser: () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return token ? { token } : null;
  },
  
  // Simulate checking if username is available (would be a real API call in production)
  checkUsernameAvailability: async (username: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // For demo purposes: usernames containing 'admin' or 'test' are considered taken
    return !username.toLowerCase().includes('admin') && 
           !username.toLowerCase().includes('test');
  }
};

export default authService;
