"use client";

import React from 'react';
import { RequireAuth } from '@/components/auth/RequireAuth';
import UserList from '@/components/users/UserList';

export default function UserManagementPage() {
    return (
        <RequireAuth roles="SuperAdmin">
            <div className="min-h-screen bg-gray-50" >
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    </div>
                    <UserList />
                </div>
            </div>
        </RequireAuth>
    );
} 