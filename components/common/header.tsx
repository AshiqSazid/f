"use client";
import React from "react";

const Header = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => {
  return (
    <div className="p-3 lg:p-6 bg-white rounded-lg border border-gray-100 overflow-hidden">
      <h1 className="text-xl lg:text-2xl font-semibold text-blue-900 tracking-tight m-0">
        {title}
      </h1>

      <p className="text-gray-700 text-xs lg:text-sm font-normal leading-relaxed mb-3">
        {description}
      </p>
      {/* Separator line */}
      <div className="h-0.5 bg-linear-to-r from-blue-800 to-transparent w-full"></div>
    </div>
  );
};

export default Header;
