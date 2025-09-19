  // Process Expenses with Categories
  const expensesWithCategories = useMemo(() => {
    return (filteredData?.filteredExpenses || []).map((expense) => {
      const category = dashboardData.categories.find(
        (cat) => cat._id === expense.category
      );
      return {
        ...expense,
        categoryName: category ? category.name : "Unknown",
      };
    });
  }, [filteredData, dashboardData]);  
  
  // Aggregate Expenses by Category
  const expensesByCategory = useMemo(() => {
    return (expensesWithCategories || []).reduce((acc, expense) => {
      if (!acc[expense.categoryName]) {
        acc[expense.categoryName] = 0;
      }
      acc[expense.categoryName] += expense.amount;
      return acc;
    }, {});
  }, [expensesWithCategories]);

  // Format Expenses by Category
  // const formattedExpenses = useMemo(() => {
  //   return Object.keys(expensesByCategory).map((category) => ({
  //     category,
  //     total: expensesByCategory[category],
  //   }));
  // }, [expensesByCategory]);

  const expensesOverTime = useMemo(() => {
    console.log("Processing expenses over time...");

    // Step 1: Extract and format expenses with date (assuming filteredData?.filteredExpenses contains your expenses)
    const result = (filteredData?.filteredExpenses || []).map((expense) => {
      // Try extracting year and month from the _id (if available)
      let { year, month } = expense._id || {};

      // If _id doesn't have year or month, try extracting from the 'date' field
      if (!year || !month) {
        if (expense.date) {
          const date = new Date(expense.date);
          year = date.getFullYear();
          month = date.getMonth() + 1; // getMonth() is 0-based
        }
      }

      // If still no year and month, log and set to 'Unknown'
      const monthYear = year && month ? `${month}-${year}` : "Unknown";

      if (monthYear === "Unknown") {
        console.warn(
          `Expense with _id ${expense._id} is missing valid year or month`
        );
      }

      return {
        ...expense,
        monthYear, // Add formatted month-year to the expense data
      };
    });

    console.log("Expenses with monthYear added:", result);
    return result;
  }, [filteredData]);

  // const formattedExpensesOverTime = useMemo(() => {
  //   console.log("Aggregating expenses by month-year...");

  //   const aggregatedData = (expensesOverTime || []).reduce((acc, expense) => {
  //     const { monthYear, amount } = expense;

  //     // Check if the monthYear is valid before aggregating
  //     if (monthYear !== "Unknown") {
  //       if (!acc[monthYear]) {
  //         acc[monthYear] = 0;
  //       }
  //       acc[monthYear] += amount; // Sum the amount for each month-year
  //     }

  //     return acc;
  //   }, {});

  //   console.log("Aggregated expenses by month-year:", aggregatedData);

  //   // Transform object into array format
  //   const formattedData = Object.entries(aggregatedData).map(
  //     ([monthYear, total]) => ({
  //       name: monthYear, // Name of the period (e.g., "12-2024")
  //       total, // Total amount for that period
  //     })
  //   );

  //   // Sort the formattedData array by 'name' (month-year)
  //   const sortedData = formattedData.sort((a, b) => {
  //     const [monthA, yearA] = a.name.split('-').map(Number);
  //     const [monthB, yearB] = b.name.split('-').map(Number);

  //     // First compare by year, then by month
  //     if (yearA !== yearB) {
  //       return yearA - yearB; // Ascending order by year
  //     }
  //     return monthA - monthB; // Ascending order by month
  //   });

  //   console.log("Sorted expenses over time:", sortedData);
  //   return sortedData;
  // }, [expensesOverTime]);
