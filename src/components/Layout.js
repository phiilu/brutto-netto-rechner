import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="text-gray-700 bg-white dark:bg-gray-900 dark:text-gray-50">{children}</div>
  );
};

export default Layout;
