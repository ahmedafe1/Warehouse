"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function Navigation() {
    const { isAuthenticated, logout, hasRole } = useAuth();

    return (
        <nav className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Link href="/" className="text-xl font-bold">
                                Warehouse
                            </Link>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link href="/warehouses" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                    Warehouses
                                </Link>
                                <Link href="/items" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                    Items
                                </Link>
                                <Link href="/suppliers" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                    Suppliers
                                </Link>
                                {hasRole('SuperAdmin') && (
                                    <Link href="/admin/users" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                        User Management
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            {isAuthenticated ? (
                                <button
                                    onClick={logout}
                                    className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link href="/auth/login" className="hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
} 