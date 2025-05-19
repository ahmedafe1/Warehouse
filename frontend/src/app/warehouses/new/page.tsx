import AddWarehouseForm from '@/components/AddWarehouseForm';
import Link from 'next/link';
import React from 'react';

const NewWarehousePage: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link href="/warehouses" className="text-indigo-600 hover:text-indigo-800 transition-colors">
                    &larr; Back to Warehouses
                </Link>
            </div>
            <AddWarehouseForm />
        </div>
    );
};

export default NewWarehousePage; 