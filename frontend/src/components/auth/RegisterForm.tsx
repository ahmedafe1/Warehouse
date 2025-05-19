"use client";

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/services/apiService';
import { RegisterUserDto } from '@/types/auth';

const RegisterForm: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState(''); // Optional, adjust if your API requires it differently
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (!email.trim()) {
            setError("Email is required.");
            return;
        }
        // Add other client-side validations as needed (e.g., password complexity)

        const userData: RegisterUserDto = {
            email: email.trim(),
            username: username.trim() || email.trim(), // Default username to email if blank, or adjust as per API
            password: password,
            // confirmPassword is not usually sent to API, but included in DTO for completeness
        };

        setSubmitting(true);
        try {
            const response = await registerUser(userData);
            // Assuming response is { success: true, message: "..." } or similar
            if (response && response.success) {
                setSuccessMessage(response.message || "Registration successful! Please log in.");
                // Optionally redirect to login page after a short delay or let user click a link
                setTimeout(() => {
                     router.push('/auth/login');
                }, 2000); // 2-second delay
            } else {
                setError(response.message || "An unexpected error occurred during registration.")
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(errorMessage);
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                    {error}
                </div>
            )}
            {successMessage && (
                <div className="p-3 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
                    {successMessage}
                </div>
            )}

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                </label>
                <div className="mt-1">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 sm:text-sm"
                        disabled={submitting}
                    />
                </div>
            </div>
            
            {/* Optional Username Field - you can remove if username is same as email by default on backend */}
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username (optional, defaults to email)
                </label>
                <div className="mt-1">
                    <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 sm:text-sm"
                        disabled={submitting}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                </label>
                <div className="mt-1">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 sm:text-sm"
                        disabled={submitting}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                </label>
                <div className="mt-1">
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 sm:text-sm"
                        disabled={submitting}
                    />
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300"
                >
                    {submitting ? 'Registering...' : 'Register'}
                </button>
            </div>
        </form>
    );
};

export default RegisterForm; 