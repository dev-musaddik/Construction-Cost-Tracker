import { useMemo } from 'react';
import { 
  processItemsWithCategories, 
  aggregateItemsByCategory, 
  formatAggregatedItems, 
  processItemsOverTime, 
  aggregateItemsOverTime, 
  sortItemsOverTime 
} from '../utils/dataProcessing';

export const useExpensesVisualizer = (filteredData, dashboardData) => {
  // Check if dashboardData and dashboardData.categories are available
  const expensesWithCategories = useMemo(() => {
    if (!dashboardData || !dashboardData?.categories) {
      return []; // Return an empty array or handle it gracefully
    }
    return processItemsWithCategories(filteredData?.filteredExpenses || [], dashboardData?.categories);
  }, [filteredData, dashboardData]);

  const expensesByCategory = useMemo(() => {
    return aggregateItemsByCategory(expensesWithCategories);
  }, [expensesWithCategories]);

  const formattedExpenses = useMemo(() => {
    return formatAggregatedItems(expensesByCategory);
  }, [expensesByCategory]);

  const expensesOverTime = useMemo(() => {
    return processItemsOverTime(filteredData?.filteredExpenses || []);
  }, [filteredData]);

  const formattedExpensesOverTime = useMemo(() => {
    const aggregatedData = aggregateItemsOverTime(expensesOverTime);
    return sortItemsOverTime(aggregatedData);
  }, [expensesOverTime]);

  return {
    expensesWithCategories,
    expensesByCategory,
    formattedExpenses,
    expensesOverTime,
    formattedExpensesOverTime,
  };
};
