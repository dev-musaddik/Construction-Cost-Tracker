import React from "react";

const EmptyState = ({ 
  icon, 
  title, 
  subtitle, 
  buttonLabel, 
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 bg-gray-50 rounded-md border border-dashed border-gray-300">
      {/* Icon */}
      <div className="w-12 h-12 text-gray-400 mb-4">
        {icon}
      </div>

      {/* Title */}
      <p className="text-lg text-gray-600">{title}</p>

      {/* Subtitle */}
      <p className="mt-2 text-sm text-gray-500">{subtitle}</p>

      {/* Button */}
      <button
        onClick={onAction}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default EmptyState;
