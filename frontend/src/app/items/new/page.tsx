"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import ItemForm from '@/components/item/ItemForm';

const AddItemPage: React.FC = () => {
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
                <Link href="/items" className="text-blue-500 hover:text-blue-700">
                    &larr; Back to All Items
                </Link>
            </div>
            <h1 className="text-3xl font-bold mb-6">Add New Item Definition</h1>
            
            <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
                 <ItemForm />
            </div>
        </div>
    );
};

export default AddItemPage; 