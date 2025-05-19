"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser as apiLoginUser, registerUser as apiRegisterUser } from '@/services/apiService';
import { LoginUserDto, RegisterUserDto, AuthenticatedUser, LoginResponseDto } from '@/types/auth';
import { jwtDecode } from 'jwt-decode'; // Using jwt-decode to get basic info from token

export interface AuthContextType {
    user: AuthenticatedUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginUserDto) => Promise<void>;
    logout: () => void;
    register: (userData: RegisterUserDto) => Promise<any>; // Or a more specific success/error type
    hasRole: (role: string | string[]) => boolean;
    hasAllRoles: (roles: string[]) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

// Helper function to get token from localStorage safely
const getTokenFromStorage = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('authToken');
    }
    return null;
};

// Helper function to decode token
const decodeToken = (token: string): AuthenticatedUser | null => {
    try {
        const decoded = jwtDecode<{ 
            sub?: string; 
            email?: string; 
            name?: string; 
            roles?: string | string[];
            role?: string | string[];
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string | string[];
        }>(token);

        console.log('Decoded token:', decoded); // Debug log

        // Handle different role claim formats
        let roles: string[] = [];
        if (decoded.roles) {
            roles = Array.isArray(decoded.roles) ? decoded.roles : [decoded.roles];
        } else if (decoded.role) {
            roles = Array.isArray(decoded.role) ? decoded.role : [decoded.role];
        } else if (decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) {
            const roleClaim = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            roles = Array.isArray(roleClaim) ? roleClaim : [roleClaim];
        }

        console.log('Processed roles:', roles); // Debug log

        const user = {
            id: decoded.sub || '',
            email: decoded.email || '',
            username: decoded.name || decoded.email || '',
            roles: roles,
        };

        console.log('Created user object:', user); // Debug log
        return user;
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
};


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<AuthenticatedUser | null>(null);
    const [token, setToken] = useState<string | null>(getTokenFromStorage());
    const [isLoading, setIsLoading] = useState<boolean>(true); // Start as true until initial check is done
    const router = useRouter();

    useEffect(() => {
        const currentToken = getTokenFromStorage();
        if (currentToken) {
            const decodedUser = decodeToken(currentToken);
            if (decodedUser) {
                setUser(decodedUser);
                setToken(currentToken);
            } else {
                // Token might be invalid or expired
                localStorage.removeItem('authToken');
                setToken(null);
                setUser(null);
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials: LoginUserDto) => {
        setIsLoading(true);
        try {
            const response: LoginResponseDto = await apiLoginUser(credentials); // apiService already stores token
            const currentToken = response.token;
            const decodedUser = decodeToken(currentToken);
            setUser(decodedUser);
            setToken(currentToken);
            // router.push('/'); // Redirect handled by LoginForm for now
        } catch (error) {
            console.error("AuthContext login error:", error);
            setUser(null);
            setToken(null);
            localStorage.removeItem('authToken'); // Ensure inconsistent state is cleared
            throw error; // Re-throw for the form to handle displaying the error
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (userData: RegisterUserDto) => {
        setIsLoading(true);
        try {
            // apiRegisterUser returns { success: true, message: "..." } or throws error
            const response = await apiRegisterUser(userData); 
            // Optionally, you could automatically log the user in here by calling login()
            // For now, we assume registration redirects to login or shows a success message.
            return response; 
        } catch (error) {
            console.error("AuthContext register error:", error);
            throw error; // Re-throw for the form to handle displaying the error
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
        }
        router.push('/auth/login'); // Redirect to login page
    };

    const isAuthenticated = !!token && !!user;

    const hasRole = (role: string | string[]): boolean => {
        if (!user) return false;
        
        const rolesToCheck = Array.isArray(role) ? role : [role];
        const hasRole = rolesToCheck.some(r => user.roles.includes(r));
        
        console.log('hasRole check:', {
            rolesToCheck,
            userRoles: user.roles,
            hasRole
        });
        
        return hasRole;
    };

    const hasAllRoles = (roles: string[]): boolean => {
        if (!user) return false;
        
        const hasAll = roles.every(role => user.roles.includes(role));
        
        console.log('hasAllRoles check:', {
            requiredRoles: roles,
            userRoles: user.roles,
            hasAll
        });
        
        return hasAll;
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            token, 
            isAuthenticated, 
            isLoading, 
            login, 
            logout, 
            register,
            hasRole,
            hasAllRoles
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 