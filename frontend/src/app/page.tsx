"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from "next/link";

const HomePage: React.FC = () => {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading) {
            if (isAuthenticated) {
                router.push('/warehouses');
            } else {
                router.push('/auth/login');
            }
        }
    }, [isAuthenticated, isLoading, router]);

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Warehouse Management System</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link href="/warehouse" className="block">
                        <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900">Warehouses</h3>
                                <p className="mt-1 text-sm text-gray-500">Manage warehouse locations and details</p>
                            </div>
                        </div>
                    </Link>
                    <Link href="/shelf" className="block">
                        <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900">Shelves</h3>
                                <p className="mt-1 text-sm text-gray-500">Manage storage shelves and their locations</p>
                            </div>
                        </div>
                    </Link>
                    <Link href="/stock" className="block">
                        <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900">Stock</h3>
                                <p className="mt-1 text-sm text-gray-500">Manage inventory and stock levels</p>
                            </div>
                        </div>
                    </Link>
                    <Link href="/item" className="block">
                        <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300">
                            <div className="px-4 py-5 sm:p-6">
                                <h3 className="text-lg font-medium text-gray-900">Items</h3>
                                <p className="mt-1 text-sm text-gray-500">Manage items and their details</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
