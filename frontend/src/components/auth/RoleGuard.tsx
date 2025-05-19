"use client";

import React from 'react';
import { useAuth } from '@/hooks/useAuth';

interface RoleGuardProps {
    children: React.ReactNode;
    roles: string | string[];
    requireAll?: boolean;
    fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
    children,
    roles,
    requireAll = false,
    fallback = (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this content.</p>
        </div>
    ),
}) => {
    const { hasRole, hasAllRoles } = useAuth();

    const hasAccess = requireAll
        ? hasAllRoles(Array.isArray(roles) ? roles : [roles])
        : hasRole(roles);

    if (!hasAccess) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}; 