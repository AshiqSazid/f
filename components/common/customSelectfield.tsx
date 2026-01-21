"use client";
import React from "react";

interface Option {
  label: string;
  value: string;
}

interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Option[];
  required?: boolean;
  placeholder?: string;
  error?: string | null;
}

const CustomSelectfield: React.FC<FormSelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  placeholder = "Select an option",
  error,
}) => {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 font-semibold"> *</span>}
      </label>

      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full px-2.5 py-1.5 border rounded-sm focus:outline-none focus:ring-1 focus:border-transparent transition-all duration-200 text-blue-950 text-sm
          ${
            error
              ? "border-red-400 focus:ring-red-400"
              : "border-gray-200 focus:ring-blue-200"
          }`}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-white border-0"
            >
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="text-red-500 text-sm font-medium mt-1">{error}</p>
      )}
    </div>
  );
};

export default CustomSelectfield;
