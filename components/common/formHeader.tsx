"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface FormHeaderProps {
  icon: LucideIcon;
  title: string;
  color?: string;
  textcolor?: string;
  description?: string;
  iconcolor?: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({
  icon: Icon,
  title,
  color = "blue",
  iconcolor = "#fff",
  textcolor = "blue",
  description,
}) => {
  return (
    <div className="flex items-center gap-3 md:mb-6">
      <div
        className={`hidden w-8 h-8 bg-${color}-100 bg-blue-400 rounded-lg md:flex items-center justify-center`}
      >
        <Icon strokeWidth={3} className={`w-5 h-5 text-${iconcolor}-600`} />
      </div>
      <div className="">
        <h3
          className={`m-0 text-lg lg:text-2xl font-bold text-${textcolor}-900`}
        >
          {title}
        </h3>
        <span className={`text-gray-400 text-[10px] md:text-xs`}>
          {description}
        </span>
      </div>
    </div>
  );
};

export default FormHeader;
