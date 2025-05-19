"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import SupplierForm from '@/components/supplier/SupplierForm';

const AddSupplierPage: React.FC = () => {
    const router = useRouter();
    const { isAuthenticated, isLoading: authIsLoading } = useAuth();

    useEffect(() => {
        if (!authIsLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, authIsLoading, router]);

    if (authIsLoading) {
        return <div className="container mx-auto p-4 text-center">Loading...</div>;
    }
    
    if (!isAuthenticated) {
        return null; 
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <Link href="/suppliers" className="text-blue-500 hover:text-blue-700">
                    &larr; Back to All Suppliers
                </Link>
            </div>
            <h1 className="text-3xl font-bold mb-6">Add New Supplier</h1>
            
            <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
                <SupplierForm />
            </div>
        </div>
    );
};

export default AddSupplierPage; 