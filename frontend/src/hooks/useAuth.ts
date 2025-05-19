import { useContext } from 'react';
import { AuthContext, AuthContextType } from '@/context/AuthContext';

export interface ExtendedAuthContextType extends AuthContextType {
    hasRole: (role: string | string[]) => boolean;
    hasAnyRole: (roles: string[]) => boolean;
    hasAllRoles: (roles: string[]) => boolean;
}

export const useAuth = (): ExtendedAuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    const hasRole = (role: string | string[]): boolean => {
        if (!context.user?.roles) return false;
        
        if (Array.isArray(role)) {
            return role.some(r => context.user?.roles?.includes(r));
        }
        
        return context.user.roles.includes(role);
    };

    const hasAnyRole = (roles: string[]): boolean => {
        return hasRole(roles);
    };

    const hasAllRoles = (roles: string[]): boolean => {
        if (!context.user?.roles) return false;
        return roles.every(role => context.user?.roles?.includes(role));
    };

    return {
        ...context,
        hasRole,
        hasAnyRole,
        hasAllRoles,
    };
}; 