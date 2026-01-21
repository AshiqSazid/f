"use client";

import { SIDEBAR_MENU } from "@/lib/constant";
import MenuItem from "./menuItem";
import Footer from "./footer";
import Image from "next/image";
import { useState } from "react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-3 left-4 z-50 lg:hidden p-2 rounded-md bg-[#338AFF] text-white shadow-lg"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
          {/* {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )} */}
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-linear-to-b from-[#338AFF] to-[#1E6FFF] shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full p-6 text-[#FDFBF7]">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center mb-8 pt-4">
            <div className="relative w-[100px] h-[100px] rounded-md mr-2">
              <Image
                src={"/theramuse.jpg"}
                alt="TheramuseRX"
                width={100}
                height={100}
                priority
                className="h-auto w-auto rounded-md"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 w-full space-y-2">
            {SIDEBAR_MENU?.map((menu) => (
              <MenuItem
                key={menu?.name}
                menu={menu}
                onClick={() => setIsOpen(false)}
              />
            ))}
          </div>

          {/* Footer Quote */}
          <Footer />
        </div>
      </aside>
    </>
  );
}
