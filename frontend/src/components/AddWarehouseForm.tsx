"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createWarehouse } from '@/services/apiService';
import { CreateWarehouseDto } from '@/types/warehouse';


const AddWarehouseForm: React.FC = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError('Warehouse name is required.');
            return;
        }

        const warehouseData: CreateWarehouseDto = {
            name: name.trim(),
            location: location.trim() || undefined, // Send undefined if location is empty
        };

        setSubmitting(true);
        try {
            await createWarehouse(warehouseData);
            // Optionally, show a success message or redirect
            router.push('/warehouses'); // Redirect to the warehouses list
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(`Failed to create warehouse: ${errorMessage}`);
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-8 bg-white shadow-md rounded-lg space-y-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">Add New Warehouse</h2>
            
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
                    className="mt-1 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 bg-white"
                    required
                    disabled={submitting}
                    placeholder="Enter warehouse name"
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
                    className="mt-1 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 bg-white"
                    disabled={submitting}
                    placeholder="Enter warehouse location"
                />
            </div>

            <div>
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {submitting ? 'Submitting...' : 'Add Warehouse'}
                </button>
            </div>
        </form>
    );
};

export default AddWarehouseForm; 