"use client";
import React from "react";
import { QUOTE, QUOTE_WRITTER } from "@/lib/constant";

const Footer = () => {
  return (
    <div className="mt-auto pt-6 border-t border-white/30">
      <blockquote className="text-[#FDFBF7]/90 text-sm italic leading-relaxed">
        <p className="font-semibold mb-2">{QUOTE}</p>
        <footer className="text-[#FDFBF7]/70 text-xs">{QUOTE_WRITTER}</footer>
      </blockquote>
    </div>
  );
};

export default Footer;
