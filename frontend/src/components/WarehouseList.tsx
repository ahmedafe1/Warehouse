"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getWarehouses } from '@/services/apiService';
import { WarehouseDto, ShelfMinimalDto } from '@/types/warehouse';

const WarehouseList: React.FC = () => {
    const [warehouses, setWarehouses] = useState<WarehouseDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWarehouses = async () => {
            try {
                setLoading(true);
                const data = await getWarehouses();
                setWarehouses(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchWarehouses();
    }, []);

    if (loading) {
        return <div className="text-center py-10">Loading warehouses...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">Error: {error}</div>;
    }

    if (warehouses.length === 0) {
        return <div className="text-center py-10">No warehouses found.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Warehouses</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {warehouses.map((warehouse) => (
                    <div key={warehouse.id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
                        <h2 className="text-2xl font-semibold text-blue-600 mb-2">{warehouse.name}</h2>
                        <p className="text-gray-600 mb-1">
                            <span className="font-medium">Location:</span> {warehouse.location || 'N/A'}
                        </p>
                        <p className="text-gray-600 mb-3">
                            <span className="font-medium">ID:</span> {warehouse.id}
                        </p>
                        {warehouse.shelves && warehouse.shelves.length > 0 && (
                            <div>
                                <h3 className="text-lg font-medium text-gray-700 mb-2">Shelves:</h3>
                                <ul className="list-disc list-inside pl-4 space-y-1">
                                    {warehouse.shelves.map((shelf: ShelfMinimalDto) => (
                                        <li key={shelf.id} className="text-sm text-gray-500">
                                            {shelf.code}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {(!warehouse.shelves || warehouse.shelves.length === 0) && (
                             <p className="text-sm text-gray-500 italic mb-4">No shelves in this warehouse.</p>
                        )}
                        <div className="mt-4">
                            <Link href={`/warehouses/edit/${warehouse.id}`} legacyBehavior>
                                <a className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                                    Edit Warehouse
                                </a>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WarehouseList; 