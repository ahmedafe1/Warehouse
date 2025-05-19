"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import EditWarehouseForm from '@/components/EditWarehouseForm';
import Link from 'next/link';

const EditWarehousePage: React.FC = () => {
    const params = useParams();
    const id = params?.id;

    // Ensure id is a string and then parse it to a number
    const warehouseId = typeof id === 'string' ? parseInt(id, 10) : null;

    if (warehouseId === null || isNaN(warehouseId)) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-red-500 text-xl">Invalid Warehouse ID.</p>
                <Link href="/warehouses" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
                    &larr; Back to Warehouses
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link href="/warehouses" className="text-indigo-600 hover:text-indigo-800 transition-colors">
                    &larr; Back to Warehouses
                </Link>
            </div>
            <EditWarehouseForm warehouseId={warehouseId} />
        </div>
    );
};

export default EditWarehousePage; 