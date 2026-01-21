"use client";
import React, { ReactNode } from "react";

const StatCard = ({
  icon,
  label,
  value,
  accent = "bg-gradient-to-br from-cyan-400 to-blue-500",
  loading = false,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  accent?: string;
  loading?: boolean;
}) => {
  if (loading) {
    return (
      <div className="relative bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-sm animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gray-200 rounded-xl" />
          <div className="space-y-2">
            <div className="h-3 w-16 bg-gray-200 rounded" />
            <div className="h-6 w-12 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      <div className="relative bg-white/90 backdrop-blur-md border border-white/30 rounded-sm p-5 pr-0 shadow-xs hover:shadow-lg transition-all duration-300 hover:scale-[1] hover:border-white/40">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Enhanced icon container */}
            <div
              className={`relative flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-xs ${accent} overflow-hidden`}
            >
              <div className="absolute inset-0 bg-white/10" />
              <div className="relative z-10">{icon}</div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                {label}
              </p>

              <p className="text-xl font-bold text-gray-900 leading-tight">
                {value.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
