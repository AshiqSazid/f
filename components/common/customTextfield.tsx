"use client";
import React from "react";

interface FormInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  type?: string;
  error?: string | null;
}

const CustomTextfield: React.FC<FormInputProps> = ({
  label,
  name,
  value,
  onChange,
  required = false,
  placeholder = "",
  type = "text",
  error,
}) => {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}{" "}
        {required && <span className="text-red-500 font-semibold">*</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={`w-full px-2.5 py-1.5 border rounded-sm focus:outline-none focus:ring-1 focus:border-transparent transition-all duration-200 text-blue-950 text-sm
          ${
            error
              ? "border-red-400 focus:ring-red-400"
              : "border-gray-200 focus:ring-blue-200"
          }`}
      />

      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
    </div>
  );
};

export default CustomTextfield;
