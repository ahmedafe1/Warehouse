"use client";

import React from 'react';

interface Column {
    header: string;
    accessor: string | ((item: any) => string | number);
}

interface ListLayoutProps {
    title: string;
    addButtonText: string;
    onAddClick: () => void;
    isLoading: boolean;
    error: string | null;
    columns: Column[];
    data: any[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

const ListLayout: React.FC<ListLayoutProps> = ({
    title,
    addButtonText,
    onAddClick,
    isLoading,
    error,
    columns,
    data,
    onEdit,
    onDelete,
}) => {
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="sm:flex sm:items-center sm:justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <button
                            onClick={onAddClick}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {addButtonText}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                        {error}
                    </div>
                )}

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {columns.map((column, index) => (
                                        <th
                                            key={index}
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            {column.header}
                                        </th>
                                    ))}
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        {columns.map((column, colIndex) => (
                                            <td
                                                key={colIndex}
                                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                                            >
                                                {typeof column.accessor === 'function'
                                                    ? column.accessor(item)
                                                    : item[column.accessor]}
                                            </td>
                                        ))}
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => onEdit(item.id)}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => onDelete(item.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListLayout; 