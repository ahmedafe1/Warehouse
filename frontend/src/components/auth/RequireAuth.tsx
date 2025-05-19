"use client";

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface RequireAuthProps {
    children: React.ReactNode;
    roles?: string | string[];
    requireAll?: boolean;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ 
    children, 
    roles, 
    requireAll = false 
}) => {
    const { isAuthenticated, isLoading, hasRole, hasAllRoles, user } = useAuth();
    const router = useRouter();

    React.useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    if (roles) {
        const hasAccess = requireAll 
            ? hasAllRoles(Array.isArray(roles) ? roles : [roles])
            : hasRole(roles);

        console.log('Role check:', {
            requiredRoles: roles,
            userRoles: user?.roles,
            hasAccess,
            requireAll
        });

        if (!hasAccess) {
            return (
                <div className="flex flex-col items-center justify-center h-screen">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
                    <p className="text-gray-600">You don't have permission to access this page.</p>
                    <p className="text-gray-500 mt-2">Required roles: {Array.isArray(roles) ? roles.join(', ') : roles}</p>
                    <p className="text-gray-500">Your roles: {user?.roles?.join(', ') || 'none'}</p>
                </div>
            );
        }
    }

    return <>{children}</>;
}; 