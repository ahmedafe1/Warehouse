"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShelfDto } from '@/types/shelf';
import { getShelves, deleteShelf } from '@/services/apiService';
import ListLayout from '@/components/layout/ListLayout';

const ShelfList: React.FC = () => {
    const router = useRouter();
    const [shelves, setShelves] = useState<ShelfDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchShelves();
    }, []);

    const fetchShelves = async () => {
        try {
            setIsLoading(true);
            const data = await getShelves();
            console.log('Fetched shelves:', data); // Debug log
            setShelves(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching shelves:', err);
            setError(err instanceof Error ? err.message : 'Failed to load shelves');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this shelf?')) {
            return;
        }

        try {
            await deleteShelf(id);
            await fetchShelves(); // Refresh the list
        } catch (err) {
            console.error('Error deleting shelf:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete shelf');
        }
    };

    const columns = [
        { header: 'Code', accessor: 'code' },
        { header: 'Warehouse', accessor: (shelf: ShelfDto) => shelf.warehouse?.name || 'N/A' },
    ];

    return (
        <ListLayout
            title="Shelves"
            addButtonText="Add New Shelf"
            onAddClick={() => router.push('/shelves/new')}
            isLoading={isLoading}
            error={error}
            columns={columns}
            data={shelves}
            onEdit={(id: number) => router.push(`/shelves/${id}/edit`)}
            onDelete={handleDelete}
        />
    );
};

export default ShelfList; 