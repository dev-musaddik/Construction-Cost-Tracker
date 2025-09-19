// Reusable function to process items (expenses or deposits) with categories
export const processItemsWithCategories = (items, categories) => {
    return items.map((item) => {
      const category = categories.find((cat) => cat._id === item.category);
      return {
        ...item,
        categoryName: category ? category.name : "Unknown",
      };
    });
  };
  
  // Reusable function to aggregate items by category (expenses or deposits)
  export const aggregateItemsByCategory = (items) => {
    return items.reduce((acc, item) => {
      if (!acc[item.categoryName]) {
        acc[item.categoryName] = 0;
      }
      acc[item.categoryName] += item.amount;
      return acc;
    }, {});
  };
  
  // Reusable function to format aggregated items by category (expenses or deposits)
  export const formatAggregatedItems = (aggregatedData) => {
    return Object.keys(aggregatedData).map((category) => ({
      category,
      total: aggregatedData[category],
    }));
  };
  
  // Reusable function to process items by month-year (expenses or deposits)
  export const processItemsOverTime = (items) => {
    return items.map((item) => {
      let { year, month } = item._id || {};
  
      if (!year || !month) {
        if (item.date) {
          const date = new Date(item.date);
          year = date.getFullYear();
          month = date.getMonth() + 1;
        }
      }
  
      const monthYear = year && month ? `${month}-${year}` : "Unknown";
      return { ...item, monthYear };
    });
  };
  
  // Reusable function to aggregate items by month-year (expenses or deposits)
  export const aggregateItemsOverTime = (items) => {
    return items.reduce((acc, item) => {
      const { monthYear, amount } = item;
      if (monthYear !== "Unknown") {
        if (!acc[monthYear]) {
          acc[monthYear] = 0;
        }
        acc[monthYear] += amount;
      }
      return acc;
    }, {});
  };
  
  // Reusable function to sort aggregated items by month-year (expenses or deposits)
  export const sortItemsOverTime = (aggregatedData) => {
    const formattedData = Object.entries(aggregatedData).map(([monthYear, total]) => ({
      name: monthYear,
      total,
    }));
  
    return formattedData.sort((a, b) => {
      const [monthA, yearA] = a.name.split('-').map(Number);
      const [monthB, yearB] = b.name.split('-').map(Number);
  
      if (yearA !== yearB) {
        return yearA - yearB;
      }
      return monthA - monthB;
    });
  };
  