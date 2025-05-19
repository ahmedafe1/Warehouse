"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getWarehouseById, updateWarehouse } from '@/services/apiService';
import { WarehouseDto, UpdateWarehouseDto } from '@/types/warehouse';

interface EditWarehouseFormProps {
    warehouseId: number;
}

const EditWarehouseForm: React.FC<EditWarehouseFormProps> = ({ warehouseId }) => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [initialLoadError, setInitialLoadError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWarehouseData = async () => {
            setIsLoading(true);
            setInitialLoadError(null);
            try {
                const data = await getWarehouseById(warehouseId);
                if (data) {
                    setName(data.name);
                    setLocation(data.location || '');
                } else {
                    setInitialLoadError(`Warehouse with ID ${warehouseId} not found.`);
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to load warehouse data';
                setInitialLoadError(errorMessage);
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (warehouseId) {
            fetchWarehouseData();
        }
    }, [warehouseId]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError('Warehouse name is required.');
            return;
        }

        const warehouseData: UpdateWarehouseDto = {
            name: name.trim(),
            location: location.trim() || undefined,
        };

        setSubmitting(true);
        try {
            await updateWarehouse(warehouseId, warehouseData);
            router.push('/warehouses'); // Redirect after successful update
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during update';
            setError(`Failed to update warehouse: ${errorMessage}`);
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="text-center py-10">Loading warehouse data...</div>;
    }

    if (initialLoadError) {
        return <div className="text-center py-10 text-red-500">Error: {initialLoadError}</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-8 bg-white shadow-md rounded-lg space-y-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Edit Warehouse (ID: {warehouseId})</h2>
            
            {error && (
                <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Warehouse Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 sm:text-sm"
                    required
                    disabled={submitting}
                />
            </div>

            <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location (Optional)
                </label>
                <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 sm:text-sm"
                    disabled={submitting}
                />
            </div>

            <div>
                <button
                    type="submit"
                    disabled={submitting || isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
                >
                    {submitting ? 'Saving Changes...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
};

export default EditWarehouseForm; 