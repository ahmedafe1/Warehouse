"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShelfDto } from '@/types/shelf';
import { WarehouseDto } from '@/types/warehouse';
import { getShelvesByWarehouse, getWarehouseById, deleteShelf as apiDeleteShelf } from '@/services/apiService';
import { useAuth } from '@/context/AuthContext';

const WarehouseShelvesPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const warehouseId = params.id ? parseInt(params.id as string, 10) : null;
    
    const { isAuthenticated, isLoading: authIsLoading } = useAuth();
    const [shelves, setShelves] = useState<ShelfDto[]>([]);
    const [warehouse, setWarehouse] = useState<WarehouseDto | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!warehouseId) {
            setError('Warehouse ID is missing.');
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setDeleteError(null);
        try {
            const [shelvesData, warehouseData] = await Promise.all([
                getShelvesByWarehouse(warehouseId),
                getWarehouseById(warehouseId)
            ]);
            setShelves(shelvesData);
            setWarehouse(warehouseData);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch warehouse shelves or warehouse details:", err);
            setError(err instanceof Error ? err.message : 'Failed to load data');
        }
        setIsLoading(false);
    }, [warehouseId]);

    useEffect(() => {
        if (authIsLoading) return;
        if (!isAuthenticated) {
            router.push('/auth/login');
            return;
        }
        fetchData();
    }, [isAuthenticated, authIsLoading, router, fetchData]);

    const handleDeleteShelf = async (shelfIdToDelete: number) => {
        if (!window.confirm("Are you sure you want to delete this shelf? This action cannot be undone.")) {
            return;
        }
        setDeleteError(null);
        try {
            await apiDeleteShelf(shelfIdToDelete);
            setShelves(prevShelves => prevShelves.filter(shelf => shelf.id !== shelfIdToDelete));
        } catch (err) {
            console.error(`Failed to delete shelf ${shelfIdToDelete}:`, err);
            const message = err instanceof Error ? err.message : 'Could not delete shelf.';
            setDeleteError(message.includes("Ensure it is empty") 
                ? "Could not delete shelf. Ensure it is empty and try again."
                : message);
        }
    };

    if (isLoading || authIsLoading) {
        return <div className="container mx-auto p-4 text-center">Loading shelves...</div>;
    }

    if (error) {
        return <div className="container mx-auto p-4 text-center text-red-500">Error loading page: {error}</div>;
    }

    if (!warehouse) {
        return <div className="container mx-auto p-4 text-center">Warehouse not found.</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Shelves in {warehouse.name}</h1>
                <Link href={`/warehouses/${warehouseId}/shelves/new`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Add New Shelf
                </Link>
            </div>

            {deleteError && (
                <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                    Delete Error: {deleteError}
                </div>
            )}
            
            {shelves.length === 0 ? (
                <p className="text-center text-gray-500">No shelves found for this warehouse.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {shelves.map((shelf) => (
                        <div key={shelf.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <h2 className="text-xl font-semibold mb-2">{shelf.name} (Code: {shelf.code})</h2>
                            {shelf.capacity && <p className="text-gray-700 mb-1">Capacity: {shelf.capacity}</p>}
                            <div className="mt-4 flex justify-end space-x-2">
                                <Link href={`/shelves/edit/${shelf.id}`} className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded">
                                    Edit
                                </Link>
                                <button 
                                    onClick={() => handleDeleteShelf(shelf.id)} 
                                    className="text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WarehouseShelvesPage; 