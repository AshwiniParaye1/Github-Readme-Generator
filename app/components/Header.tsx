// components/Header.tsx

import Link from "next/link";
import React from "react";
import { FaCoffee, FaGithub } from "react-icons/fa";

const Header = () => {
  return (
    <header className="bg-gray-800 text-white py-4 fixed w-full top-0 z-10">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaGithub className="w-6 h-6" />
          <h1 className="text-xl font-bold">README Generator</h1>
        </div>
        <Link
          href="https://github.com/AshwiniParaye1/Github-Readme-Generator"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
        >
          <FaCoffee className="w-4 h-4" />
          <span>Support Project</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
