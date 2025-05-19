"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SupplierDto, CreateSupplierDto, UpdateSupplierDto } from '@/types/supplier';
import { createSupplier, updateSupplier, getSupplierById } from '@/services/apiService';
import FormLayout from '@/components/layout/FormLayout';
import FormField from '@/components/common/FormField';

interface SupplierFormProps {
    supplierId?: number;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ supplierId }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<CreateSupplierDto | UpdateSupplierDto>({
        name: '',
        contactPerson: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            if (supplierId) {
                try {
                    const supplierData = await getSupplierById(supplierId);
                    if (supplierData) {
                        setFormData({
                            name: supplierData.name,
                            contactPerson: supplierData.contactPerson || '',
                            email: supplierData.email || '',
                            phone: supplierData.phone || ''
                        });
                    }
                } catch (err) {
                    console.error('Error fetching supplier:', err);
                    setError(err instanceof Error ? err.message : 'Failed to load supplier data');
                }
            }
        };

        fetchData();
    }, [supplierId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (supplierId) {
                await updateSupplier(supplierId, formData as UpdateSupplierDto);
            } else {
                await createSupplier(formData as CreateSupplierDto);
            }
            router.push('/suppliers');
        } catch (err) {
            console.error('Error saving supplier:', err);
            setError(err instanceof Error ? err.message : 'Failed to save supplier');
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <FormLayout
            title={supplierId ? 'Edit Supplier' : 'Add New Supplier'}
            backLink="/suppliers"
            backText="Back to Suppliers"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                        {error}
                    </div>
                )}

                <FormField
                    label="Supplier Name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter supplier name"
                />

                <FormField
                    label="Contact Person"
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    placeholder="Enter contact person name"
                />

                <FormField
                    label="Email"
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                />

                <FormField
                    label="Phone"
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                />

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => router.push('/suppliers')}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {isLoading ? 'Saving...' : supplierId ? 'Update Supplier' : 'Create Supplier'}
                    </button>
                </div>
            </form>
        </FormLayout>
    );
};

export default SupplierForm; 