import React from 'react';

const Banner = ({ children }) => {
  return (
    <div className="bg-green-600">
      <div className="px-3 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center ">
          <div className="flex items-center justify-center flex-1 w-0">
            <span className="flex p-2 bg-green-800 rounded-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </span>
            <p className="ml-3 font-medium text-white ">{children}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
