
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';

const DepositFilter = ({
  descriptionFilter,
  setDescriptionFilter,
  minAmount,
  setMinAmount,
  maxAmount,
  setMaxAmount,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handleApplyFilters,
  resetFilters,
}) => {
  const { t } = useTranslation();

  return (
    <div className="mb-4 flex flex-wrap gap-4 w-full justify-start">
      {/* Description Filter */}
      <div className="flex-1 min-w-[220px] w-full sm:w-auto">
        <label
          htmlFor="descriptionFilter"
          className="mb-2 text-sm font-medium text-gray-700"
        >
          {t('searchByDescription')}
        </label>
        <input
          id="descriptionFilter"
          type="text"
          className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={t('searchByDescription')}
          value={descriptionFilter}
          onChange={(e) => setDescriptionFilter(e.target.value)}
          aria-label={t('searchByDescription')}
        />
      </div>

      {/* Min Amount */}
      <div className="flex-1 min-w-[220px] w-full sm:w-auto">
        <label
          htmlFor="minAmount"
          className="mb-2 text-sm font-medium text-gray-700"
        >
          {t('minAmount')}
        </label>
        <input
          id="minAmount"
          type="number"
          className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={t('minAmount')}
          value={minAmount}
          onChange={(e) => setMinAmount(e.target.value)}
          aria-label={t('minAmount')}
        />
      </div>

      {/* Max Amount */}
      <div className="flex-1 min-w-[220px] w-full sm:w-auto">
        <label
          htmlFor="maxAmount"
          className="mb-2 text-sm font-medium text-gray-700"
        >
          {t('maxAmount')}
        </label>
        <input
          id="maxAmount"
          type="number"
          className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={t('maxAmount')}
          value={maxAmount}
          onChange={(e) => setMaxAmount(e.target.value)}
          aria-label={t('maxAmount')}
        />
      </div>

      {/* Start Date */}
      <div className="flex-1 min-w-[220px] w-full sm:w-auto">
        <label
          htmlFor="startDate"
          className="mb-2 text-sm font-medium text-gray-700"
        >
          {t('startDate')}
        </label>
        <input
          id="startDate"
          type="date"
          className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          aria-label={t('startDate')}
        />
      </div>

      {/* End Date */}
      <div className="flex-1 min-w-[220px] w-full sm:w-auto">
        <label
          htmlFor="endDate"
          className="mb-2 text-sm font-medium text-gray-700"
        >
          {t('endDate')}
        </label>
        <input
          id="endDate"
          type="date"
          className="border p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          aria-label={t('endDate')}
        />
      </div>

      {/* Apply Filters Button */}
      <div className="flex flex-wrap gap-3 w-full justify-center sm:justify-start items-end sm:items-end p-1 text-sm">
        <Button
          variant="apply"
          onClick={handleApplyFilters}
          className="w-full sm:w-auto"
        >
          {t('applyFilters')}
        </Button>

        {/* Reset Filters Button */}
        <Button
          variant="destructive"
          className="w-full sm:w-auto p-2 rounded-lg text-white"
          onClick={resetFilters}
          aria-label={t('resetFilters')}
        >
          {t('resetFilters')}
        </Button>
      </div>
    </div>
  );
};

export default DepositFilter;
