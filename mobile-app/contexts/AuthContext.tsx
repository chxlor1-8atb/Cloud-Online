import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, saveAuth, clearAuth } from '@/lib/storage';
import type { User } from '@/lib/api';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (user: User) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Load auth state on mount
    useEffect(() => {
        loadAuthState();
    }, []);

    const loadAuthState = async () => {
        try {
            const auth = await getAuth();
            if (auth?.isAuthenticated && auth?.user) {
                setUser(auth.user);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Error loading auth:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (userData: User) => {
        setUser(userData);
        setIsAuthenticated(true);
        await saveAuth({ user: userData, isAuthenticated: true });
    };

    const logout = async () => {
        setUser(null);
        setIsAuthenticated(false);
        await clearAuth();
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
