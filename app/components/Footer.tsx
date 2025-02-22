// components/Footer.tsx
import React from "react";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 fixed w-full bottom-0 z-10">
      <div className="container mx-auto px-4 text-center flex items-center justify-center">
        <p className="text-sm mr-2">Made with ❤️ by</p>
        <a
          href="https://github.com/AshwiniParaye1" // Replace with your GitHub profile
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold hover:text-gray-300 flex items-center"
        >
          Ashwini Paraye <FaGithub className="ml-1" size={14} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
