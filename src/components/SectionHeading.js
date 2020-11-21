import React from 'react';

const SectionHeading = ({ title, highlight, children, ...props }) => {
  return (
    <div className="text-center" {...props}>
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
        <span className="block xl:inline">{title}</span>{' '}
        <span className="block text-green-600 xl:inline">{highlight}</span>
      </h1>
      <p className="max-w-md mx-auto mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
        {children}
      </p>
    </div>
  );
};

export default SectionHeading;
