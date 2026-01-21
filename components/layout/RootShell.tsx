"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/sidebar/sidebar";
import Navbar from "@/components/navbar/navbar";

export default function RootShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  if (isLanding) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-[rgba(169,197,235,0.15)]">
      <Sidebar />
      <main className="flex-1 lg:ml-64 bg-linear-to-br from-[#FDFBF7] to-[#E7F0FF] transition-all duration-300">
        <Navbar />
        {children}
      </main>
    </div>
  );
}
