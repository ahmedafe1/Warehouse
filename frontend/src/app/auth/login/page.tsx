"use client";

import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';
import React from 'react';

const LoginPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {
                    // You can add a logo here if you have one
                    /* <img
                        className="mx-auto h-12 w-auto"
                        src="/logo.svg" // Replace with your logo path
                        alt="Workflow"
                    /> */
                }
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Or{
                        ' '
                    }
                    <Link href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                        create a new account
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
};

export default LoginPage; 