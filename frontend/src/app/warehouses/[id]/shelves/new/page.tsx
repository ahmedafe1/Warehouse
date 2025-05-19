"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { WarehouseDto } from '@/types/warehouse';
import { getWarehouseById } from '@/services/apiService';
import { useAuth } from '@/context/AuthContext';
import ShelfForm from '@/components/shelf/ShelfForm';

const AddShelfPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const warehouseId = params.id ? parseInt(params.id as string, 10) : null;

    const { isAuthenticated, isLoading: authIsLoading } = useAuth();
    const [warehouse, setWarehouse] = useState<WarehouseDto | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authIsLoading) return; 
        if (!isAuthenticated) {
            router.push('/auth/login');
            return;
        }

        if (warehouseId) {
            setIsLoading(true);
            getWarehouseById(warehouseId)
                .then(data => {
                    if (data) {
                        setWarehouse(data);
                    } else {
                        setError('Warehouse not found.');
                    }
                })
                .catch(err => {
                    console.error("Failed to fetch warehouse details:", err);
                    setError(err instanceof Error ? err.message : 'Failed to load warehouse data');
                })
                .finally(() => setIsLoading(false));
        } else {
            setError('Warehouse ID is missing.');
            setIsLoading(false);
        }
    }, [warehouseId, isAuthenticated, authIsLoading, router]);

    if (isLoading || authIsLoading) {
        return <div className="container mx-auto p-4 text-center">Loading...</div>;
    }

    if (error) {
        return <div className="container mx-auto p-4 text-center text-red-500">Error: {error}</div>;
    }

    if (!warehouse || !warehouseId) {
        return <div className="container mx-auto p-4 text-center">Warehouse not found or ID missing.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <Link href={`/warehouses/${warehouseId}/shelves`} className="text-blue-500 hover:text-blue-700">
                    &larr; Back to Shelves in {warehouse.name}
                </Link>
            </div>
            <h1 className="text-3xl font-bold mb-6">Add New Shelf to {warehouse.name}</h1>
            
            <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
                 <ShelfForm warehouseId={warehouseId} />
            </div>
        </div>
    );
};

export default AddShelfPage; 