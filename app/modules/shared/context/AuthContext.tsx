import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AuthContextType {
    token: string | null;
    user: User | null;
    isLoading: boolean;
    login: (token: string, userData: User) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load token and user data from storage on app start
        const loadAuthData = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('auth_token');
                const storedUserData = await AsyncStorage.getItem('user_data');

                if (storedToken) {
                    setToken(storedToken);
                    setUser(storedUserData ? JSON.parse(storedUserData) : null);
                }
            } catch (error) {
                console.error('Error loading auth data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadAuthData();
    }, []);

    const login = async (newToken: string, userData: User) => {
        try {
            await AsyncStorage.setItem('auth_token', newToken);
            await AsyncStorage.setItem('user_data', JSON.stringify(userData || {}));

            setToken(newToken);
            setUser(userData);
        } catch (error) {
            console.error('Error saving auth data:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('auth_token');
            await AsyncStorage.removeItem('user_data');

            setToken(null);
            setUser(null);

            // Redirigir al login después de cerrar sesión
            router.replace('/(routes)/auth/login');
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