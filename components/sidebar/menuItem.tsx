"use client";

import React from "react";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface MenuItemProps {
  menu: {
    name: string;
    href: string;
    icon: LucideIcon;
  };
  onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ menu, onClick }) => {
  const pathname = usePathname();
  const isActiveRoute = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  const Icon = menu.icon;
  const isActive = isActiveRoute(menu.href);

  return (
    <Link
      href={menu?.href}
      onClick={onClick}
      className={`flex items-center px-2 py-2 rounded-md transition-all duration-200 text-sm ${
        isActive
          ? "bg-[#FDFBF7] text-[#338AFF] shadow-sm"
          : "text-[#FDFBF7] hover:bg-white/10"
      }`}
    >
      <Icon className="w-5 h-5 mx-3" />
      <span className="font-medium">{menu?.name}</span>
    </Link>
  );
};

export default MenuItem;
