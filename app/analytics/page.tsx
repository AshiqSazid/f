"use client";
import React from "react";
import Header from "@/components/common/header";

const Analytics = () => {
  return (
    <div className="min-h-screen max-w-6xl mx-auto space-y-6 bg-linear-to-br from-slate-50 to-blue-50/30 py-8">
      {/* Header Section */}
      <Header
        title={"Analytics Dashboard"}
        description={"Monitor system performance and user engagement"}
      />
    </div>
  );
};

export default Analytics;
