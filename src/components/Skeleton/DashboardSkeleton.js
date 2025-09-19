import React, { useState, useEffect } from "react";


const DashboardSkeleton = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setLoading(false); // Data has been loaded after 3 seconds
    }, 3000);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Dashboard Header */}
      <div className="flex justify-between mb-8">
        <div className="flex space-x-4">
          <div className="w-32 h-8 bg-gray-300 rounded-md"></div>
          <div className="w-32 h-8 bg-gray-300 rounded-md"></div>
        </div>
        <div className="flex space-x-6">
          <div className="w-36 h-16 bg-gray-300 rounded-md"></div>
          <div className="w-36 h-16 bg-gray-300 rounded-md"></div>
          <div className="w-36 h-16 bg-gray-300 rounded-md"></div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="flex gap-8 mb-8">
        <div className="w-1/2 h-48 bg-gray-300 rounded-lg"></div>
        <div className="w-1/2 h-48 bg-gray-300 rounded-lg"></div>
      </div>

      {/* Category Charts */}
      <div className="flex gap-8">
        <div className="w-1/2 h-64 bg-gray-300 rounded-lg"></div>
        <div className="w-1/2 h-64 bg-gray-300 rounded-lg"></div>
      </div>

      {/* When data is loading */}
      {loading ? (
        <div className="mt-8 text-center text-lg text-gray-500">Loading...</div>
      ) : (
        <div className="mt-8 text-center text-lg text-gray-500">Dashboard Loaded</div>
      )}
    </div>
  );
};

export default DashboardSkeleton;
