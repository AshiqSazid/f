"use client";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="bg-white flex justify-center items-center h-16 w-full px-4 sticky top-0 border-b border-gray-200 z-30">
      <div className="relative w-[150px] sm:w-[180px] md:w-[200px]">
        <Image
          src="/logo.png"
          alt="TheramuseRX"
          width={200}
          height={0}
          priority
          className="w-full h-auto object-contain"
        />
      </div>
    </nav>
  );
};

export default Navbar;
