import React from "react";

// This is a sub-component for a single skeleton row to keep the code DRY and clean.
// The randomized width for the description makes the skeleton look more dynamic.
const SkeletonRow = () => (
  <div className="flex items-center px-6 py-4 border-b border-gray-200 last:border-b-0">
    {/* Description Placeholder */}
    <div className="w-1/4">
      <div
        className="h-4 bg-gray-200 rounded"
        style={{ width: `${50 + Math.random() * 40}%` }}
      ></div>
    </div>
    {/* Amount Placeholder */}
    <div className="w-1/4 text-center">
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
    </div>
    {/* Date Placeholder */}
    <div className="w-1/4 text-center">
      <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
    </div>
    {/* Actions Placeholder */}
    <div className="w-1/4 flex justify-center space-x-2">
      {/* These placeholders are styled to look like the final buttons */}
      <div className="h-8 w-16 bg-gray-100 border border-gray-300 rounded-md"></div>
      <div className="h-8 w-16 bg-red-200 border border-gray-300 rounded-md"></div>
    </div>
  </div>
);

// The main reusable skeleton component.
// It accepts a 'rowCount' prop to determine how many skeleton rows to display.
const DESkeleton = ({ DE, rowCount = 5 }) => {
  return (
    <div className="overflow-x-auto bg-[url('https://www.transparenttextures.com/patterns/lined-paper.png')] bg-repeat p-6 font-[Patrick Hand,Comic Sans MS,cursive]">
      {/* Header section with title and "Add Deposit" link, as in your example */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">{DE}</h1>
        <a href="#" className="text-blue-600 font-medium hover:underline">
          Add Deposit
        </a>
      </div>

      {/* The main container styled to look like a sheet of paper */}
      <div className="min-w-full   bg-transparent">
        {/* Table Header Row */}
        <div className="px-6 py-3 bg-transparent border-b border-gray-200">
          <div className="flex items-center text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            <div className="w-1/4">Description</div>
            <div className="w-1/4 text-center">Amount</div>
            <div className="w-1/4 text-center">Date</div>
            <div className="w-1/4 text-center pr-8">Actions</div>
          </div>
        </div>

        {/* Skeleton Rows Container with pulsing animation */}
        <div className="animate-pulse">
          {/* Create an array of a specific length and map over it to render rows */}
          {Array.from({ length: rowCount }).map((_, index) => (
            <SkeletonRow key={index} />
          ))}
        </div>

        {/* Footer Row Skeleton */}
        <div className="px-6 py-4 bg-transparent border-t-4 border-gray-300">
          <div className="flex items-center text-left font-bold">
            <div className="w-2/5 text-gray-800">Total</div>
            <div className="w-1/5 text-right animate-pulse">
              <div className="h-5 bg-gray-300 rounded w-1/2 mx-auto"></div>
            </div>
            <div className="w-2/5"></div> {/* Empty cells for alignment */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DESkeleton;
