"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ItemDto, CreateItemDto, UpdateItemDto } from '@/types/item';
import { SupplierDto } from '@/types/supplier';
import { getItemById, createItem, updateItem, getSuppliers } from '@/services/apiService';
import FormLayout from '@/components/layout/FormLayout';

interface ItemFormProps {
    itemId?: number;
}

const ItemForm: React.FC<ItemFormProps> = ({ itemId }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [suppliers, setSuppliers] = useState<SupplierDto[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        description: '',
        price: '0',
        supplierId: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const suppliersData = await getSuppliers();
                setSuppliers(suppliersData);
                
                if (itemId) {
                    const item = await getItemById(itemId);
                    if (item) {
                        setFormData({
                            name: item.name || '',
                            sku: item.sku || '',
                            description: item.description || '',
                            price: item.price?.toString() || '0',
                            supplierId: item.supplierId?.toString() || '',
                        });
                    }
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err instanceof Error ? err.message : 'Failed to load data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [itemId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const itemData: CreateItemDto | UpdateItemDto = {
                name: formData.name,
                sku: formData.sku,
                description: formData.description,
                price: parseFloat(formData.price),
                supplierId: parseInt(formData.supplierId),
            };

            if (itemId) {
                await updateItem(itemId, itemData as UpdateItemDto);
            } else {
                await createItem(itemData as CreateItemDto);
            }

            router.push('/items');
        } catch (err) {
            console.error('Error saving item:', err);
            setError(err instanceof Error ? err.message : 'Failed to save item');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <FormLayout
            title={itemId ? 'Edit Item' : 'New Item'}
            isLoading={isLoading}
            error={error}
            backLink="/items"
            backText="Back to Items"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 sm:text-sm"
                    />
                </div>

                {/* <div>
                    <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                        SKU
                    </label>
                    <input
                        type="text"
                        name="sku"
                        id="sku"
                        required
                        value={formData.sku}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 sm:text-sm"
                    />
                </div> */}

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Price
                    </label>
                    <input
                        type="number"
                        name="price"
                        id="price"
                        required
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700">
                        Supplier
                    </label>
                    <select
                        name="supplierId"
                        id="supplierId"
                        required
                        value={formData.supplierId}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 sm:text-sm"
                    >
                        <option value="">Select a supplier</option>
                        {suppliers.map(supplier => (
                            <option key={supplier.id} value={supplier.id}>
                                {supplier.name}
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

export default ItemForm; 