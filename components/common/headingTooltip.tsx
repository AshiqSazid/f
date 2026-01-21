"use client";
import React from "react";

const HeadingTooltip = ({
  title,
  tooltipDescription,
}: {
  title: string;
  tooltipDescription: string;
}) => {
  return (
    <div className="flex flex-col items-center text-center md:items-start md:text-left overflow-visible">
      <div className="relative flex items-start justify-center gap-4 md:justify-start overflow-visible">
        {/* Title */}
        <h1 className="text-3xl font-bold bg-gray-800 bg-clip-text text-transparent md:text-5xl">
          {title}
        </h1>

        {/* Tooltip Trigger */}
        <div className="hidden relative lg:inline-flex h-10 w-10 mt-1.5 items-center justify-center rounded-full border border-gray-200 bg-gray-500 text-lg font-semibold text-white shadow-lg cursor-pointer transition-all duration-300 hover:scale-110 group z-40">
          <span className="transition-transform duration-300 group-hover:scale-110">
            i
          </span>

          {/* Tooltip */}
          <div className="pointer-events-none absolute left-1/2 top-12 hidden w-72 -translate-x-1/2 transform group-hover:block">
            <div className="relative rounded-md bg-linear-to-br from-white to-gray-50 p-4 shadow-2xl ring-1 ring-gray-200/60">
              {/* Arrow */}
              <div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-white"></div>

              {/* Description */}
              <p className="text-xs font-normal text-justify text-gray-700">
                {tooltipDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeadingTooltip;
