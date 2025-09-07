import React from "react";

const PieChartSkeleton = ({ items = 2 }) => {
  const renderSkeletonItems = () => {
    let skeletonItems = [];
    for (let i = 0; i < items; i++) {
      skeletonItems.push(
        <div key={i} className="flex items-center space-x-2 animate-pulse mb-2">
          <div className="h-4 w-4 rounded-full bg-gray-300"></div>
          <div className="h-4 w-24 bg-gray-300 rounded-md"></div>
        </div>
      );
    }
    return skeletonItems;
  };

  return (
    <div className="space-y-4 max-w-full overflow-hidden">
      {/* Header */}
      <div className="animate-pulse bg-gray-300 h-6 w-48 rounded-md mb-4"></div>

      {/* Pie chart skeleton */}
      <div className="w-32 h-32 bg-gray-200 rounded-full animate-pulse mx-auto mb-4"></div>

      {/* Pie chart legend skeleton */}
      <div className="space-y-2 flex flex-col items-center">{renderSkeletonItems()}</div>
    </div>
  );
};

export default PieChartSkeleton;
