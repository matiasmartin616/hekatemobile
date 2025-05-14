import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { authApi, RegisterRequest } from '@modules/auth/api/auth-api';

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AuthContextType {
    token: string | null;
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadAuthData = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('auth_token');

                if (storedToken) {
                    // Verify token and get fresh user data
                    const profile = await authApi.getProfile();
                    setToken(storedToken);
                    setUser(profile);
                }
            } catch (error) {
                console.error('Error loading auth data:', error);
                await AsyncStorage.removeItem('auth_token');
            } finally {
                setIsLoading(false);
            }
        };

        loadAuthData();
    }, []);


    const register = async (userData: RegisterRequest) => {
        setIsLoading(true);
        try {
            const profile = await authApi.register(userData);
            await AsyncStorage.setItem('auth_token', profile.token);
            setToken(profile.token);
            setUser(profile.user);

            router.replace('/(routes)/(private)/(tabs)');
        } catch (error) {
            console.error('Error during register:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            // Get fresh user data after successful login
            const profile = await authApi.login({ email, password });

            await AsyncStorage.setItem('auth_token', profile.token);
            setToken(profile.token);
            setUser(profile.user);

            router.replace('/(routes)/(private)/(tabs)');
        } catch (error) {
            console.error('Error during login:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('auth_token');
            await AsyncStorage.removeItem('user_data');

            setToken(null);
            setUser(null);

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
                user,
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