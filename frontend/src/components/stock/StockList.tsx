"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StockDto } from '@/types/stock';
import { getStocks, deleteStock } from '@/services/apiService';
import ListLayout from '@/components/layout/ListLayout';
import { formatDate } from '@/utils/dateUtils';

const StockList: React.FC = () => {
    const router = useRouter();
    const [stocks, setStocks] = useState<StockDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchStocks();
    }, []);

    const fetchStocks = async () => {
        try {
            setIsLoading(true);
            const data = await getStocks();
            console.log('Fetched stocks:', data); // Debug log
            setStocks(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching stocks:', err);
            setError(err instanceof Error ? err.message : 'Failed to load stocks');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this stock?')) {
            return;
        }

        try {
            await deleteStock(id);
            await fetchStocks(); // Refresh the list
        } catch (err) {
            console.error('Error deleting stock:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete stock');
        }
    };

    const columns = [
        { header: 'Item', accessor: (stock: StockDto) => stock.item?.name || 'N/A' },
        { header: 'Shelf', accessor: (stock: StockDto) => stock.shelf?.code || 'N/A' },
        { header: 'Quantity', accessor: 'quantity' },
        { header: 'Last Updated', accessor: (stock: StockDto) => formatDate(stock.lastUpdated) },
    ];

    return (
        <ListLayout
            title="Stocks"
            addButtonText="Add New Stock"
            onAddClick={() => router.push('/stock/new')}
            isLoading={isLoading}
            error={error}
            columns={columns}
            data={stocks}
            onEdit={(id: number) => router.push(`/stock/${id}/edit`)}
            onDelete={handleDelete}
        />
    );
};

export default StockList; 