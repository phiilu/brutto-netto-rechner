import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen text-gray-700 bg-gray-100 dark:bg-gray-900 dark:text-gray-50">
      {children}
    </div>
  );
};

export default Layout;
