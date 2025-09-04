
import React from 'react';
import { Button } from './ui/button';

const DashboardFilter = ({ onFilterChange }) => {
  const handleFilterClick = (filter) => {
    onFilterChange(filter);
  };

  return (
    <div className="flex justify-center space-x-4 mb-4">
      <Button onClick={() => handleFilterClick('today')}>Today</Button>
      <Button onClick={() => handleFilterClick('weekly')}>Weekly</Button>
      <Button onClick={() => handleFilterClick('monthly')}>Monthly</Button>
    </div>
  );
};

export default DashboardFilter;
