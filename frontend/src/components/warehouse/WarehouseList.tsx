"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { WarehouseDto } from '@/types/warehouse';
import { getWarehouses, deleteWarehouse } from '@/services/apiService';
import ListLayout from '@/components/layout/ListLayout';

const WarehouseList: React.FC = () => {
    const [warehouses, setWarehouses] = useState<WarehouseDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWarehouses = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getWarehouses();
            setWarehouses(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching warehouses:', err);
            setError(err instanceof Error ? err.message : 'Failed to load warehouses');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWarehouses();
    }, [fetchWarehouses]);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this warehouse?')) {
            return;
        }

        try {
            await deleteWarehouse(id);
            await fetchWarehouses();
        } catch (err) {
            console.error('Error deleting warehouse:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete warehouse');
        }
    };

    const columns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Location', accessor: 'location' },
        { header: 'Capacity', accessor: 'capacity' },
    ];

    return (
        <ListLayout
            title="Warehouses"
            addButtonText="Add New Warehouse"
            onAddClick={() => window.location.href = '/warehouses/new'}
            isLoading={isLoading}
            error={error}
            columns={columns}
            data={warehouses}
            onEdit={(id: number) => window.location.href = `/warehouses/edit/${id}`}
            onDelete={handleDelete}
        />
    );
};

export default WarehouseList; 