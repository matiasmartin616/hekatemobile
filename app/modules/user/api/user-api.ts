import { api } from "@shared/services/api";

// Types for authentication
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  role: string;
}

// Authentication API functions
export const userApi = {
  /**
   * Get current user profile data
   */
  getProfile: async (): Promise<User> => {
    try {
      return await api.get<User>("/user/profile");
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Error al obtener el perfil de usuario");
    }
  },

  updateUser: async (name: string): Promise<User> => {
    try {
      return await api.patch<User>("/user/profile", { name });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Error al actualizar el perfil de usuario");
    }
  },
  
};

export default userApi;
