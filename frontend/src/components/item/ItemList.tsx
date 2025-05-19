"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ItemDto } from '@/types/item';
import { getItems, deleteItem } from '@/services/apiService';
import ListLayout from '@/components/layout/ListLayout';

const ItemList: React.FC = () => {
    const [items, setItems] = useState<ItemDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchItems = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getItems();
            setItems(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching items:', err);
            setError(err instanceof Error ? err.message : 'Failed to load items');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this item?')) {
            return;
        }

        try {
            await deleteItem(id);
            await fetchItems();
        } catch (err) {
            console.error('Error deleting item:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete item');
        }
    };

    const columns = [
        { header: 'Name', accessor: 'name' },
        { header: 'SKU', accessor: 'sku' },
        { header: 'Supplier', accessor: (item: ItemDto) => item.supplier?.name || 'N/A' },
        { header: 'Description', accessor: 'description' },
    ];

    return (
        <ListLayout
            title="Items"
            addButtonText="Add New Item"
            onAddClick={() => window.location.href = '/items/new'}
            isLoading={isLoading}
            error={error}
            columns={columns}
            data={items}
            onEdit={(id: number) => window.location.href = `/items/${id}/edit`}
            onDelete={handleDelete}
        />
    );
};

export default ItemList; 