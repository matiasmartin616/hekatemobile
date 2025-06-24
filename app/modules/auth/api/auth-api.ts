import { api } from "@shared/services/api";
import { User } from "@modules/user/api/user-api";

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  googleToken?: string;
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

export interface VerifyPasswordResetCodeRequest {
  email: string;
  code: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface VerifyPasswordResetCodeResponse {
  valid: boolean;
  message: string;
}

// Authentication API functions
export const authApi = {
  /**
   * Login user with email and password or Google token
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      return await api.post<AuthResponse>("/auth/login", credentials, {
        authenticated: false,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Error al intentar iniciar sesión");
    }
  },

  /**
   * Login with Google token
   */
  loginWithGoogle: async (googleToken: string): Promise<AuthResponse> => {
    try {
      return await api.post<AuthResponse>(
        "/auth/google",
        { token: googleToken },
        { authenticated: false }
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Error al intentar iniciar sesión con Google");
    }
  },

  /**
   * Login with Google token
   */
  loginWithGoogle: async (googleToken: string): Promise<AuthResponse> => {
    try {
      return await api.post<AuthResponse>('/auth/google', { token: googleToken }, { authenticated: false });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error al intentar iniciar sesión con Google');
    }
  },

  /**
   * Register a new user
   */
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    try {
      return await api.post<AuthResponse>("/auth/register", userData, {
        authenticated: false,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Error al intentar registrarse");
    }
  },

  /**
   * Verify password reset code
   */
  verifyPasswordResetCode: async (
    request: VerifyPasswordResetCodeRequest
  ): Promise<VerifyPasswordResetCodeResponse> => {
    return await api.post<VerifyPasswordResetCodeResponse>(
      "/auth/verify-reset-code",
      request
    );
  },

  requestPasswordResetCode: async (email: string): Promise<void> => {
    return await api.post("/auth/forgot-password", { email });
  },

  resetPassword: async (request: ResetPasswordRequest): Promise<void> => {
    return await api.post("/auth/reset-password", request);
  },
};

export default authApi;
