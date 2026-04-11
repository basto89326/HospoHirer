"use client";

import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

return (
    <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#EAEAEA]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <button
          onClick={() => scrollTo("top")}
          className="flex items-center gap-2 font-bold text-xl cursor-pointer"
        >
          <i className="fa-solid fa-utensils"></i>
          <span>HospoHirer</span>
        </button>

        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
          <button
            onClick={() => scrollTo("features")}
            className="hover:text-[#111111] transition cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollTo("directory")}
            className="hover:text-[#111111] transition cursor-pointer"
          >
            Browse Directory
          </button>
          <button
            onClick={() => scrollTo("benefits")}
            className="hover:text-[#111111] transition cursor-pointer"
          >
            Features
          </button>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="/auth/login"
            className="hidden md:block text-sm font-medium text-[#111111] hover:text-gray-600 transition"
          >
            Log in
          </a>

          <button
            className="md:hidden flex flex-col gap-1.5 p-1 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-0.5 bg-[#111111] transition-transform duration-200 ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-[#111111] transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-5 h-0.5 bg-[#111111] transition-transform duration-200 ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[#EAEAEA] bg-white/95 backdrop-blur-md px-6 py-4 flex flex-col gap-1">
          <button
            onClick={() => scrollTo("features")}
            className="text-left text-sm font-medium text-gray-600 hover:text-[#111111] transition py-2.5 border-b border-gray-100 cursor-pointer"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollTo("directory")}
            className="text-left text-sm font-medium text-gray-600 hover:text-[#111111] transition py-2.5 border-b border-gray-100 cursor-pointer"
          >
            Browse Directory
          </button>
          <button
            onClick={() => scrollTo("benefits")}
            className="text-left text-sm font-medium text-gray-600 hover:text-[#111111] transition py-2.5 border-b border-gray-100 cursor-pointer"
          >
            Features
          </button>
          <a
            href="/auth/login"
            className="text-left text-sm font-medium text-[#111111] hover:text-gray-600 transition py-2.5"
          >
            Log in
          </a>
        </div>
      )}
    </nav>
  );
}
