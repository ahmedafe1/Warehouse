"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StockDto, CreateStockDto, UpdateStockDto } from '@/types/stock';
import { getItems, getShelves } from '@/services/apiService';
import { createStock, updateStock, getStockById } from '@/services/apiService';
import FormLayout from '@/components/layout/FormLayout';

interface StockFormProps {
    stockId?: number;
}

const StockForm: React.FC<StockFormProps> = ({ stockId }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [items, setItems] = useState<{ id: number; name: string }[]>([]);
    const [shelves, setShelves] = useState<{ id: number; code: string }[]>([]);
    const [formData, setFormData] = useState({
        itemId: '',
        shelfId: '',
        quantity: '',
    });

    useEffect(() => {
        fetchItems();
        fetchShelves();
        if (stockId) {
            fetchStock();
        }
    }, [stockId]);

    const fetchItems = async () => {
        try {
            const data = await getItems();
            setItems(data);
        } catch (err) {
            console.error('Error fetching items:', err);
            setError(err instanceof Error ? err.message : 'Failed to load items');
        }
    };

    const fetchShelves = async () => {
        try {
            const data = await getShelves();
            setShelves(data);
        } catch (err) {
            console.error('Error fetching shelves:', err);
            setError(err instanceof Error ? err.message : 'Failed to load shelves');
        }
    };

    const fetchStock = async () => {
        if (!stockId) return;
        try {
            setIsLoading(true);
            const stock = await getStockById(stockId);
            setFormData({
                itemId: stock.itemId?.toString() || '',
                shelfId: stock.shelfId?.toString() || '',
                quantity: stock.quantity?.toString() || '',
            });
        } catch (err) {
            console.error('Error fetching stock:', err);
            setError(err instanceof Error ? err.message : 'Failed to load stock');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const stockData: CreateStockDto | UpdateStockDto = {
                itemId: parseInt(formData.itemId),
                shelfId: parseInt(formData.shelfId),
                quantity: parseInt(formData.quantity),
            };

            if (stockId) {
                await updateStock(stockId, stockData as UpdateStockDto);
            } else {
                await createStock(stockData as CreateStockDto);
            }

            router.push('/stock');
        } catch (err) {
            console.error('Error saving stock:', err);
            setError(err instanceof Error ? err.message : 'Failed to save stock');
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
            title={stockId ? 'Edit Stock' : 'New Stock'}
            isLoading={isLoading}
            error={error}
            backLink="/stock"
            backText="Back to Stock"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="itemId" className="block text-sm font-medium text-gray-700">
                        Item
                    </label>
                    <select
                        name="itemId"
                        id="itemId"
                        required
                        value={formData.itemId}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 sm:text-sm"
                    >
                        <option value="">Select an item</option>
                        {items.map(item => (
                            <option key={item.id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="shelfId" className="block text-sm font-medium text-gray-700">
                        Shelf
                    </label>
                    <select
                        name="shelfId"
                        id="shelfId"
                        required
                        value={formData.shelfId}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 sm:text-sm"
                    >
                        <option value="">Select a shelf</option>
                        {shelves.map(shelf => (
                            <option key={shelf.id} value={shelf.id}>
                                {shelf.code}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                        Quantity
                    </label>
                    <input
                        type="number"
                        name="quantity"
                        id="quantity"
                        required
                        min="1"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 sm:text-sm"
                    />
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

export default StockForm; 