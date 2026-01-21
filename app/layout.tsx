import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import RootShell from "@/components/layout/RootShell";
import { ToastProvider } from "@/provider/ToastProvider";

export const metadata: Metadata = {
  title: "TheramuseRX - Music Therapy",
  description: "Personalized music therapy for cognitive enhancement",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body cz-shortcut-listen="true" suppressHydrationWarning>
        <ToastProvider />
        <RootShell>{children}</RootShell>
      </body>
    </html>
  );
}
