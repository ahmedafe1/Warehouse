"use client";

import React from 'react';

interface FormFieldProps {
    label: string;
    id: string;
    type?: string;
    value: string | number | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    required?: boolean;
    placeholder?: string;
    error?: string;
    children?: React.ReactElement<{
        className?: string;
        id?: string;
        name?: string;
        value?: string | number;
        onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
        required?: boolean;
        placeholder?: string;
    }>;
}

const FormField: React.FC<FormFieldProps> = ({
    label,
    id,
    type = 'text',
    value,
    onChange,
    required = false,
    placeholder,
    error,
    children
}) => {
    const baseInputClass = "mt-1 block w-full px-3 py-2 rounded-md shadow-sm bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm";
    const textClass = "text-gray-900";
    const placeholderClass = "placeholder-gray-500";
    const errorClass = error ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500" : "";

    const inputClassName = `${baseInputClass} ${textClass} ${placeholderClass} ${errorClass}`;

    return (
        <div className="mb-6">
            <label htmlFor={id} className="block text-sm font-medium text-gray-900 mb-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {children ? (
                React.cloneElement(children, {
                    className: inputClassName,
                    id,
                    name: id,
                    value: value || '',
                    onChange,
                    required,
                    placeholder
                })
            ) : (
                <input
                    type={type}
                    id={id}
                    name={id}
                    value={value || ''}
                    onChange={onChange}
                    required={required}
                    placeholder={placeholder}
                    className={inputClassName}
                    style={{ color: '#111827' }}
                />
            )}
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
};

export default FormField; 