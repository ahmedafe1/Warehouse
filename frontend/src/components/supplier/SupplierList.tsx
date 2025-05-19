"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { SupplierDto } from '@/types/supplier';
import { getSuppliers, deleteSupplier } from '@/services/apiService';
import ListLayout from '@/components/layout/ListLayout';

const SupplierList: React.FC = () => {
    const [suppliers, setSuppliers] = useState<SupplierDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSuppliers = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getSuppliers();
            setSuppliers(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching suppliers:', err);
            setError(err instanceof Error ? err.message : 'Failed to load suppliers');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this supplier?')) {
            return;
        }

        try {
            await deleteSupplier(id);
            await fetchSuppliers();
        } catch (err) {
            console.error('Error deleting supplier:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete supplier');
        }
    };

    const columns = [
        { header: 'Name', accessor: 'name' },
        { header: 'Contact Person', accessor: 'contactPerson' },
        { header: 'Email', accessor: 'email' },
        { header: 'Phone', accessor: 'phone' },
    ];

    return (
        <ListLayout
            title="Suppliers"
            addButtonText="Add New Supplier"
            onAddClick={() => window.location.href = '/suppliers/new'}
            isLoading={isLoading}
            error={error}
            columns={columns}
            data={suppliers}
            onEdit={(id: number) => window.location.href = `/suppliers/edit/${id}`}
            onDelete={handleDelete}
        />
    );
};

export default SupplierList; 