"use client";

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
// import { loginUser } from '@/services/apiService'; // No longer directly calling apiService
import { LoginUserDto } from '@/types/auth';
import { useAuth } from '@/context/AuthContext'; // Import useAuth

const LoginForm: React.FC = () => {
    const router = useRouter();
    const { login, isLoading: authIsLoading } = useAuth(); // Use login from context
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    // const [submitting, setSubmitting] = useState<boolean>(false); // isLoading from context will handle this

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        // setSubmitting(true); // Handled by authIsLoading

        const credentials: LoginUserDto = {
            username: username.trim(),
            password: password,
        };

        try {
            await login(credentials); // Call context login function
            // Login successful, token stored by AuthContext, user state updated by AuthContext
            console.log("Login successful via AuthContext");
            router.push('/'); // Redirect to a dashboard or home page
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during login';
            setError(errorMessage);
            console.error("Login form submission error:", err);
        } 
        // finally {
        //    setSubmitting(false); // Handled by authIsLoading
        // }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Email address or Username
                </label>
                <div className="mt-1">
                    <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username email"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 sm:text-sm"
                        disabled={authIsLoading} // Use authIsLoading
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
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 sm:text-sm"
                        disabled={authIsLoading} // Use authIsLoading
                    />
                </div>
            </div>

            {/* Optional: Add a "Forgot password?" link here */}
            {/* <div className="flex items-center justify-between">
                <div className="text-sm">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Forgot your password?
                    </a>
                </div>
            </div> */}

            <div>
                <button
                    type="submit"
                    disabled={authIsLoading} // Use authIsLoading
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300"
                >
                    {authIsLoading ? 'Signing in...' : 'Sign in'}
                </button>
            </div>
        </form>
    );
};

export default LoginForm; 