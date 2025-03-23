import { router } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi, User } from "../api/auth-api";

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        setIsAuthenticated(!!token);
        
        if (token) {
          // Optional: Get user profile
          try {
            const profile = await authApi.getProfile();
            setUser(profile);
          } catch (error) {
            // If there's an error getting the profile, the token might be invalid
            await AsyncStorage.removeItem('auth_token');
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, user, isLoading };
}
