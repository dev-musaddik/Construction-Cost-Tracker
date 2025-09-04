import React from "react";
import { Skeleton } from "./ui/skeleton";

const SkeletonLoader = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        <Skeleton className="h-10 w-[200px] rounded-md bg-gray-200" />
      </h1>
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        {/* Category Filter Skeleton */}
        <div className="flex-1 min-w-[150px]">
          <label
            htmlFor="categoryFilter"
            className="block text-sm font-medium text-gray-700"
          >
            <Skeleton className="h-4 w-[100px] mb-2 bg-gray-200" />
          </label>
          <Skeleton className="h-10 w-full rounded-md bg-gray-200" />
        </div>

        {/* Date Filter Skeleton */}
        <div className="flex-1 min-w-[150px]">
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700"
          >
            <Skeleton className="h-4 w-[100px] mb-2 bg-gray-200" />
          </label>
          <Skeleton className="h-10 w-full rounded-md bg-gray-200" />
        </div>

        <div className="flex-1 min-w-[150px]">
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700"
          >
            <Skeleton className="h-4 w-[100px] mb-2 bg-gray-200" />
          </label>
          <Skeleton className="h-10 w-full rounded-md bg-gray-200" />
        </div>

        {/* Sort and Order Filters Skeleton */}
        <div className="flex-1 min-w-[150px]">
          <label
            htmlFor="sortBy"
            className="block text-sm font-medium text-gray-700"
          >
            <Skeleton className="h-4 w-[100px] mb-2 bg-gray-200" />
          </label>
          <Skeleton className="h-10 w-full rounded-md bg-gray-200" />
        </div>

        <div className="flex-1 min-w-[150px]">
          <label
            htmlFor="sortOrder"
            className="block text-sm font-medium text-gray-700"
          >
            <Skeleton className="h-4 w-[100px] mb-2 bg-gray-200" />
          </label>
          <Skeleton className="h-10 w-full rounded-md bg-gray-200" />
        </div>

        {/* Page Size Selector Skeleton */}
        <div className="flex-1 min-w-[120px]">
          <label
            htmlFor="pageSize"
            className="block text-sm font-medium text-gray-700"
          >
            <Skeleton className="h-4 w-[100px] mb-2 bg-gray-200" />
          </label>
          <Skeleton className="h-10 w-full rounded-md bg-gray-200" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="overflow-x-auto">
        <Skeleton className="h-[400px] w-full rounded-md bg-gray-200" />
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex flex-wrap gap-4 mt-4">
        <Skeleton className="h-10 w-[120px] rounded-md bg-gray-200" />
        <Skeleton className="h-10 w-[120px] rounded-md bg-gray-200" />
        <Skeleton className="h-10 w-[120px] rounded-md bg-gray-200" />
        <Skeleton className="h-10 w-[120px] rounded-md bg-gray-200" />
      </div>
    </div>
  );
};

export default SkeletonLoader;
