import React from 'react';

// A sub-component for a single category skeleton row.
// This keeps the main component cleaner and easier to read.
const SkeletonRow = () => (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 last:border-b-0">
        {/* Category Name Placeholder */}
        <div className="w-2/5">
            <div className="h-4 bg-gray-200 rounded" style={{ width: `${40 + Math.random() * 50}%` }}></div>
        </div>
        {/* Actions Placeholder */}
        <div className="w-2/5 flex justify-center space-x-2">
            {/* Placeholders are styled to look like the final yellow and red buttons */}
            <div className="h-8 w-16 bg-yellow-300 opacity-50 rounded-md"></div>
            <div className="h-8 w-16 bg-red-400 opacity-50 rounded-md"></div>
        </div>
    </div>
);

// The main reusable skeleton component for the Categories page.
// It accepts a 'rowCount' prop to easily configure the number of skeleton rows.
const CategoriesSkeleton = ({ rowCount = 4 }) => {
    return (
        <div className="w-full  mx-auto p-4 md:p-6">
            {/* Header section with title and a placeholder for the "Add Category" button */}
            <div className=" items-center mb-5">
                <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
                {/* Button Placeholder */}
               
                <div className="w-full flex justify-center"><div className="h-10 w-32 bg-blue-500 opacity-60 rounded-md"></div></div>
                 
            </div>
            
            {/* The main container styled to look like a sheet of paper or a card */}
            <div className="min-w-full bg-white border border-gray-200">
                
                {/* Table Header Row */}
                <div className="px-6 py-3 bg-white border-b-2 border-gray-300">
                    <div className="flex items-center justify-between text-left text-sm font-bold text-gray-700 tracking-wider">
                        <div className="w-1/2">Name</div>
                        <div className="w-1/2 text-right">Actions</div>
                    </div>
                </div>

                {/* Skeleton Rows Container with pulsing animation */}
                <div className="animate-pulse">
                    {/* Create an array based on rowCount and map over it to render each row */}
                    {Array.from({ length: rowCount }).map((_, index) => (
                        <SkeletonRow key={index} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoriesSkeleton;