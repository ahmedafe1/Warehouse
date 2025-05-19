'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupplierById, updateSupplier } from '@/services/apiService';
import { SupplierDto, UpdateSupplierDto } from '@/types/supplier';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function EditSupplierPage({ params }: PageProps) {
    const router = useRouter();
    const [supplier, setSupplier] = useState<SupplierDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<UpdateSupplierDto>({
        name: '',
        contactName: '',
        email: '',
        phoneNumber: '',
        address: ''
    });

    useEffect(() => {
        const fetchSupplier = async () => {
            try {
                const resolvedParams = await params;
                if (!resolvedParams?.id) return;
                
                const data = await getSupplierById(parseInt(resolvedParams.id));
                if (data) {
                    setSupplier(data);
                    setFormData({
                        name: data.name,
                        contactName: data.contactName || '',
                        email: data.email || '',
                        phoneNumber: data.phoneNumber || '',
                        address: data.address || ''
                    });
                }
                setError(null);
            } catch (err) {
                setError('Failed to fetch supplier');
                console.error('Error fetching supplier:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSupplier();
    }, [params]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const resolvedParams = await params;
            if (!resolvedParams?.id) return;

            // Ensure required fields are present
            if (!formData.name || !formData.email) {
                setError('Name and Email are required fields');
                return;
            }

            await updateSupplier(parseInt(resolvedParams.id), {
                name: formData.name,
                email: formData.email,
                contactName: formData.contactName || undefined,
                phoneNumber: formData.phoneNumber || undefined,
                address: formData.address || undefined
            });
            router.push('/suppliers');
        } catch (err) {
            setError('Failed to update supplier');
            console.error('Error updating supplier:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Supplier</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
                            Contact Name
                        </label>
                        <input
                            type="text"
                            name="contactName"
                            id="contactName"
                            value={formData.contactName}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email *
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            id="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            id="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => router.push('/suppliers')}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 