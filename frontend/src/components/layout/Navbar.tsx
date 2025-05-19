"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const Navbar: React.FC = () => {
    const pathname = usePathname();
    const { logout ,hasRole} = useAuth();
    console.log("hasrole***************** superadmin",hasRole('SuperAdmin'));
    console.log("hasrole***************** manager",hasRole('Manager'));
    console.log("hasrole***************** logistic",hasRole('Logistic'));
    const isActive = (path: string) => pathname === path;

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="text-xl font-bold text-gray-800">
                                WMS
                            </Link>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                        {(hasRole('SuperAdmin') || hasRole('Manager') || hasRole('Logistic')) && (
                            <Link
                                href="/warehouses"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                    isActive('/warehouses')
                                        ? 'border-blue-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                }`}
                            >
                                Warehouses
                            </Link>
                            )}
                            {(hasRole('SuperAdmin') || hasRole('Manager') || hasRole('Logistic')) && (
                            <Link
                                href="/shelves"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                    isActive('/shelves')
                                        ? 'border-blue-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                }`}
                            >
                                Shelves
                            </Link>
                            )}
                            {(hasRole('SuperAdmin') || hasRole('Manager') || hasRole('Logistic')) && (
                            <Link
                                href="/stock"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                    isActive('/stock')
                                        ? 'border-blue-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                }`}
                            >
                                Stock
                            </Link>
                            )}
                            {(hasRole('SuperAdmin') || hasRole('Manager') || hasRole('Logistic')) && (
                            <Link
                                href="/items"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                    isActive('/items')
                                        ? 'border-blue-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                }`}
                            >
                                Items
                            </Link>
                            )}
                            {(hasRole('SuperAdmin') || hasRole('Manager') || hasRole('Logistic')) && (
                            <Link
                                href="/suppliers"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                    isActive('/suppliers')
                                        ? 'border-blue-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                }`}
                            >
                                Suppliers
                            </Link>
                            )}
                            {hasRole('SuperAdmin') && (
                                    <Link 
                                    href="/admin/users" 
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                        isActive('/admin/users')
                                            ? 'border-blue-500 text-gray-900'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    }`}
                                    >
                                        User Management
                                    </Link>
                                )}
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <button
                            onClick={logout}
                            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 