"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WarehouseDto, CreateWarehouseDto, UpdateWarehouseDto } from '@/types/warehouse';
import { createWarehouse, updateWarehouse, getWarehouseById } from '@/services/apiService';
import FormLayout from '@/components/layout/FormLayout';
import FormField from '@/components/common/FormField';

interface WarehouseFormProps {
    warehouseId?: number;
}

const WarehouseForm: React.FC<WarehouseFormProps> = ({ warehouseId }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<CreateWarehouseDto | UpdateWarehouseDto>({
        name: '',
        location: '',
        capacity: undefined
    });

    useEffect(() => {
        const fetchData = async () => {
            if (warehouseId) {
                try {
                    const warehouseData = await getWarehouseById(warehouseId);
                    if (warehouseData) {
                        setFormData({
                            name: warehouseData.name,
                            location: warehouseData.location || '',
                            capacity: warehouseData.capacity
                        });
                    }
                } catch (err) {
                    console.error('Error fetching warehouse:', err);
                    setError(err instanceof Error ? err.message : 'Failed to load warehouse data');
                }
            }
        };

        fetchData();
    }, [warehouseId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (warehouseId) {
                await updateWarehouse(warehouseId, formData as UpdateWarehouseDto);
            } else {
                await createWarehouse(formData as CreateWarehouseDto);
            }
            router.push('/warehouses');
        } catch (err) {
            console.error('Error saving warehouse:', err);
            setError(err instanceof Error ? err.message : 'Failed to save warehouse');
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'capacity' ? (value ? Number(value) : undefined) : value
        }));
    };

    return (
        <FormLayout
            title={warehouseId ? 'Edit Warehouse' : 'Add New Warehouse'}
            backLink="/warehouses"
            backText="Back to Warehouses"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-1">
                        Warehouse Name
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter warehouse name"
                        className="mt-1 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-900 mb-1">
                        Location
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Enter warehouse location"
                        className="mt-1 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-900 mb-1">
                        Capacity
                    </label>
                    <input
                        type="number"
                        id="capacity"
                        name="capacity"
                        value={formData.capacity || ''}
                        onChange={handleChange}
                        placeholder="Enter warehouse capacity"
                        className="mt-1 block w-full px-3 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900"
                    />
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => router.push('/warehouses')}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {isLoading ? 'Saving...' : warehouseId ? 'Update Warehouse' : 'Create Warehouse'}
                    </button>
                </div>
            </form>
        </FormLayout>
    );
};

export default WarehouseForm; 