"use client";

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

type ComponentType<P = {}> = React.ComponentType<P>;

export function withRole<P extends object>(
    WrappedComponent: ComponentType<P>,
    roles: string | string[],
    requireAll: boolean = false
): ComponentType<P> {
    const WithRoleComponent: ComponentType<P> = (props: P) => {
        const { hasRole, hasAllRoles, isAuthenticated, isLoading } = useAuth();
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

        const hasAccess = requireAll
            ? hasAllRoles(Array.isArray(roles) ? roles : [roles])
            : hasRole(roles);

        if (!hasAccess) {
            return (
                <div className="flex flex-col items-center justify-center h-screen">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
                    <p className="text-gray-600">You don't have permission to access this page.</p>
                </div>
            );
        }

        return <WrappedComponent {...props} />;
    };

    WithRoleComponent.displayName = `WithRole(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return WithRoleComponent;
} 