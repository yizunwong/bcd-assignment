import React from "react";
import Link from "next/link";

const Header = () => (
  <header className="bg-black shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-md flex items-center justify-center bg-gradient-to-r from-indigo-600 to-indigo-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="..." clipRule="evenodd" />
          </svg>
        </div>
        <span className="ml-2 text-xl font-semibold text-white">YourApp</span>
      </div>
      <nav>
        <ul className="flex space-x-6">
          <li>
            <Link
              href="#"
              className="text-white-500 hover:text-indigo-600 text-sm font-medium"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-white-500 hover:text-indigo-600 text-sm font-medium"
            >
              Features
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-white-500 hover:text-indigo-600 text-sm font-medium"
            >
              Pricing
            </Link>
          </li>
          <li>
            <Link href="/login" className="text-indigo-600 text-sm font-medium">
              Login
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
);

export default Header;
