import React from "react";

const SkeletonCard = ({ type, items = 3 }) => {
  const renderSkeletonItems = () => {
    let skeletonItems = [];
    for (let i = 0; i < items; i++) {
      skeletonItems.push(
        <div key={i} className="flex items-center justify-between mb-4 animate-pulse">
          <div className="h-6 bg-gray-300 w-32 rounded-md"></div>
          <div className="h-6 bg-gray-300 w-24 rounded-md"></div>
        </div>
      );
    }
    return skeletonItems;
  };

  return (
    <div className="space-y-6">
      <div className="animate-pulse bg-gray-200 rounded-xl p-4">
        {/* Header with dynamic title */}
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-gray-300 w-32 rounded-md"></div>
          <div className="h-6 bg-gray-300 w-24 rounded-md"></div>
        </div>

        {/* Type-Specific Content */}
        {type === "deposit" && (
          <div className="h-4 bg-gray-300 w-48 rounded-md mb-3"></div>
        )}
        {type === "expense" && (
          <div className="h-4 bg-gray-300 w-40 rounded-md mb-3"></div>
        )}

        {/* List of Skeleton Items */}
        {renderSkeletonItems()}

        {/* Footer with dynamic layout */}
        <div className="flex items-center mt-4">
          <div className="h-4 bg-gray-300 w-16 rounded-md"></div>
          <div className="h-4 bg-gray-300 w-24 ml-4 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
