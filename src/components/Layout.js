import React from 'react';
import Footer from '@components/Footer';

const Layout = ({ children }) => {
  return (
    <div
      className="grid min-h-screen grid-cols-1 gap-8 text-gray-700 bg-gray-100 dark:bg-gray-900 dark:text-gray-50"
      style={{ gridTemplateRows: '1fr auto' }}>
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
