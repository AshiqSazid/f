"use client";
import React from "react";

interface FormButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "white" | "black";
  fullWidth?: boolean;
  minWidth?: string; // e.g. "min-w-60"
}

const variantClasses: Record<string, string> = {
  primary: "bg-linear-to-b from-[#338AFF] to-[#1E6FFF] text-white",
  secondary:
    "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300",
  danger:
    "bg-gradient-to-br from-red-600 to-pink-500 hover:from-red-700 hover:to-pink-600 text-white",
  // white: "bg-white hover:bg-gray-50 text-gray-800 border border-gray-300",
  black:
    "bg-purple-100 hover:bg-purple-200 text-gray-800 border border-purple-300",
};

const CustomButton: React.FC<FormButtonProps> = ({
  type = "button",
  onClick,
  loading = false,
  disabled = false,
  children,
  variant = "primary",
  fullWidth = false,
  minWidth,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`px-8 py-2 font-semibold rounded-lg shadow-lg transition-all duration-200 cursor-pointer
        ${variantClasses[variant]}
        ${fullWidth ? "w-full" : ""}
        ${minWidth ? minWidth : ""}
        disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default CustomButton;
