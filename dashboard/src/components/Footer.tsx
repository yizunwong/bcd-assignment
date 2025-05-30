import React from "react";

const Footer = () => (
  <footer className="bg-black border-t border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-sm text-white-500">
            © 2023 YourApp. All rights reserved.
          </p>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="text-white-400 hover:text-gray-500 text-sm">
            Privacy Policy
          </a>
          <a href="#" className="text-white-400 hover:text-gray-500 text-sm">
            Terms of Service
          </a>
          <a href="#" className="text-white-400 hover:text-gray-500 text-sm">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
