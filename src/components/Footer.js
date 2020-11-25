import React from 'react';

const year = new Date().getFullYear();
const Footer = () => {
  return (
    <footer className="bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 text-gray-400 md:order-2">
          <a href="https://phiilu.com">
            Made by <strong className="text-green-600">@phiilu</strong>
          </a>
        </div>
        <div className="mt-8 md:mt-0 md:order-1">
          <p className="text-base text-center text-gray-400">
            &copy; {year} Florian Kapfenberger. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
