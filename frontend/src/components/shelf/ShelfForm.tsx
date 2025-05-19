"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShelfDto, CreateShelfDto, UpdateShelfDto } from '@/types/shelf';
import { getWarehouses } from '@/services/apiService';
import { createShelf, updateShelf, getShelfById } from '@/services/apiService';
import FormLayout from '@/components/layout/FormLayout';

interface ShelfFormProps {
    shelfId?: number;
    warehouseId?: number;
    shelf?: ShelfDto;
    onFormSubmit?: () => void;
}

const ShelfForm: React.FC<ShelfFormProps> = ({ shelfId, warehouseId, shelf, onFormSubmit }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [warehouses, setWarehouses] = useState<{ id: number; name: string }[]>([]);
    const [formData, setFormData] = useState({
        code: '',
        warehouseId: '',
    });

    useEffect(() => {
        fetchWarehouses();
        if (shelfId) {
            fetchShelf();
        } else if (warehouseId) {
            setFormData(prev => ({
                ...prev,
                warehouseId: warehouseId.toString()
            }));
        }
    }, [shelfId, warehouseId]);

    const fetchWarehouses = async () => {
        try {
            const data = await getWarehouses();
            setWarehouses(data);
        } catch (err) {
            console.error('Error fetching warehouses:', err);
            setError(err instanceof Error ? err.message : 'Failed to load warehouses');
        }
    };

    const fetchShelf = async () => {
        if (!shelfId) return;
        try {
            setIsLoading(true);
            const shelfData = await getShelfById(shelfId);
            if (shelfData) {
                setFormData({
                    code: shelfData.code,
                    warehouseId: shelfData.warehouseId.toString(),
                });
            }
        } catch (err) {
            console.error('Error fetching shelf:', err);
            setError(err instanceof Error ? err.message : 'Failed to load shelf');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const shelfData: CreateShelfDto | UpdateShelfDto = {
                code: formData.code,
                warehouseId: parseInt(formData.warehouseId),
            };

            if (shelfId) {
                await updateShelf(shelfId, shelfData as UpdateShelfDto);
                if (onFormSubmit) {
                    onFormSubmit();
                } else {
                    router.push(`/shelves`);
                }
            } else {
                await createShelf(shelfData as CreateShelfDto);
                router.push('/shelves');
            }
        } catch (err) {
            console.error('Error saving shelf:', err);
            setError(err instanceof Error ? err.message : 'Failed to save shelf');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <FormLayout
            title={shelfId ? 'Edit Shelf' : 'New Shelf'}
            isLoading={isLoading}
            error={error}
            backLink="/shelves"
            backText="Back to Shelves"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                        Code
                    </label>
                    <input
                        type="text"
                        name="code"
                        id="code"
                        required
                        value={formData.code}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="warehouseId" className="block text-sm font-medium text-gray-700">
                        Warehouse
                    </label>
                    <select
                        name="warehouseId"
                        id="warehouseId"
                        required
                        value={formData.warehouseId}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 sm:text-sm"
                    >
                        <option value="">Select a warehouse</option>
                        {warehouses.map(warehouse => (
                            <option key={warehouse.id} value={warehouse.id}>
                                {warehouse.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </FormLayout>
    );
};

export default ShelfForm; 