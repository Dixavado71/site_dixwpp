import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance with credentials enabled for cookie-based auth
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Required for sending/receiving session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// CSRF token storage
let csrfToken: string | null = null;

// Function to fetch CSRF token - MUST be called before any POST/PUT/DELETE/PATCH request
// This follows the exact flow: 1) GET cookie, 2) Read X-CSRF-Token header, 3) Use token in mutation
export const fetchCsrfToken = async (): Promise<string | null> => {
  try {
    // Make a GET request to the root or health endpoint to get the session cookie and CSRF token
    // The backend sets the connect.sid cookie and returns X-CSRF-Token header
    const response = await axios.get(`${API_BASE_URL}/health`, {
      withCredentials: true, // CRUCIAL: Send and receive cookies
    });
    
    // Read the X-CSRF-Token header from the response
    const token = response.headers['x-csrf-token'];
    if (token) {
      csrfToken = token;
      console.log('CSRF token obtained:', token);
      return token;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    return null;
  }
};

// Request interceptor to add CSRF token to mutating requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const method = config.method?.toUpperCase();
    const mutatingMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
    
    if (method && mutatingMethods.includes(method)) {
      if (csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken;
      }
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Update CSRF token if received in response headers
    const newToken = response.headers['x-csrf-token'];
    if (newToken) {
      csrfToken = newToken;
    }
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    
    if (status === 401) {
      // Unauthorized - redirect to login
      window.location.href = '/login';
      localStorage.removeItem('user');
    } else if (status === 403) {
      // Check if it's a CSRF token issue
      const code = (error.response?.data as any)?.code;
      if (code === 'INVALID_CSRF_TOKEN' || code === 'CSRF_TOKEN_MISSING') {
        // Try to refresh CSRF token and retry
        fetchCsrfToken().then(() => {
          // Could retry the original request here
        });
      }
    }
    
    return Promise.reject(error);
  }
);

// Initialize CSRF token on app start
export const initializeCsrfToken = async () => {
  await fetchCsrfToken();
};

export default apiClient;
