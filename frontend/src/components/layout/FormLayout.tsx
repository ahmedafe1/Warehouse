"use client";

import React from 'react';
import Link from 'next/link';

interface FormLayoutProps {
    title: string;
    isLoading?: boolean;
    error?: string | null;
    onSubmit?: (e: React.FormEvent) => void;
    backLink?: string;
    backText?: string;
    children: React.ReactNode;
}

const FormLayout: React.FC<FormLayoutProps> = ({
    title,
    isLoading = false,
    error = null,
    onSubmit,
    backLink,
    backText = 'Back',
    children
}) => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
                    {backLink && (
                        <Link
                            href={backLink}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {backText}
                        </Link>
                    )}
                </div>

                {error && (
                    <div className="mb-4 p-4 rounded-md bg-red-50">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">{error}</h3>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormLayout; 