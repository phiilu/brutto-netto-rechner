import React from 'react';

export function DescriptionListItem({ title, children }) {
  return (
    <div className="flex flex-col py-4 sm:flex-row sm:py-5 sm:px-6">
      <dt className="text-sm font-medium text-gray-500">{title}</dt>
      <dd className="flex-1 mt-1 text-sm text-gray-900 sm:text-right sm:mt-0">{children}</dd>
    </div>
  );
}

const DescriptionList = ({ children }) => {
  return (
    <div className="px-4 py-5 border-t border-gray-200 sm:p-0">
      <dl className="sm:divide-y sm:divide-gray-200">{children}</dl>
    </div>
  );
};

export default DescriptionList;
