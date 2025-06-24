import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { authApi, RegisterRequest } from '@modules/auth/api/auth-api';
import { queryClient } from '../services/query-client';
import userApi, { User } from '@modules/user/api/user-api';
import useUserProfile from '../../user/hooks/use-user-profile';
export interface AuthContextType {
    token: string | null;
    user: User | undefined;
    isLoading: boolean;
    login: (email: string, password: string, googleToken?: string) => Promise<void>;
    register: (userData: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const { data: userProfile, isLoading } = useUserProfile();

    useEffect(() => {
        const loadAuthData = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('auth_token');

                if (storedToken) {
                    // Verify token and get fresh user data
                    setToken(storedToken);
                }
            } catch (error) {
                console.error('Error loading auth data:', error);
                await AsyncStorage.removeItem('auth_token');
            }
        };

        loadAuthData();
    }, []);


    const register = async (userData: RegisterRequest) => {
        try {
            // Clear all query cache first
            queryClient.clear();

            const profile = await authApi.register(userData);
            await AsyncStorage.setItem('auth_token', profile.token);
            setToken(profile.token);

            router.replace('/(routes)/(private)/(tabs)');
        } catch (error) {
            console.error('Error during register:', error);
            throw error;
        }
    }

    const login = async (email: string, password: string, googleToken?: string) => {
        try {
            // Clear all query cache first
            queryClient.clear();

            let profile;
            if (googleToken) {
                profile = await authApi.loginWithGoogle(googleToken);
            } else {
                profile = await authApi.login({ email, password });
            }

            await AsyncStorage.setItem('auth_token', profile.token);
            setToken(profile.token);

            router.replace('/(routes)/(private)/(tabs)');
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            // Clear all query cache on logout as well
            queryClient.clear();

            await AsyncStorage.removeItem('auth_token');
            await AsyncStorage.removeItem('user_data');

            setToken(null);

            // Redirigir al login después de cerrar sesión
            router.replace('/(routes)/(public)/auth/welcome');
        } catch (error) {
            console.error('Error clearing auth data:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                user: userProfile,
                isLoading,
                login,
                logout,
                register,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthContext };
export default AuthProvider;