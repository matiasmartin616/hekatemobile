import { api } from '@shared/services/api';

// Types for authentication
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthError {
  error: string;
  info?: string;
  message?: string;
}

// Authentication API functions
export const authApi = {
  /**
   * Login user with email and password
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      return await api.post<AuthResponse>('/auth/login', credentials, { authenticated: false });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error al intentar iniciar sesión');
    }
  },

  /**
   * Register a new user
   */
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      return await api.post<AuthResponse>('/auth/register', userData, { authenticated: false });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error al intentar registrarse');
    }
  },

  /**
   * Get current user profile data
   */
  getProfile: async (): Promise<User> => {
    try {
      return await api.get<User>('/auth/profile');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error al obtener el perfil de usuario');
    }
  }
};

export default authApi;
