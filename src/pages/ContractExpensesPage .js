import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n"; // Make sure path is correct

const ContractExpensesPage = () => {
  const { t } = useTranslation();

  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [agreementAmounts, setAgreementAmounts] = useState({}); // Store agreement amounts for each category
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const userString = localStorage.getItem("user");
        const user = JSON.parse(userString);

        const response = await axios.get(
        //   "https://construction-cost-tracker-server-g2.vercel.app/api/categories",
          "http://localhost:5000/api/expenses/contract/",
          {
            params:{isContract: true},
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
            },
          }

        );
         // ✅ Get expenses from response
const fetchedExpenses = response.data.expenses || [];

// ✅ Extract unique categories from expenses
const uniqueCategories = [
  ...new Map(
    fetchedExpenses.map((item) => [item.category?._id, item.category])
  ).values(),
];

console.log("Unique Categories:", uniqueCategories);
setCategories(uniqueCategories)

        if (response.data.length > 0) {
            setSelectedCategory(response?.data[0]._id);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(t("noExpenses"));
      }
    };

    fetchCategories();
  }, [t]);

//   // Fetch categories on mount
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const userString = localStorage.getItem("user");
//         const user = JSON.parse(userString);

//         const response = await axios.get(
//           "https://construction-cost-tracker-server-g2.vercel.app/api/categories",
//           {
//             params:{isContract: true},
//             headers: {
//               Authorization: `Bearer ${user.token}`,
//               "Content-Type": "application/json",
//             },
//           }

//         );

//         setCategories(response.data);
//         console.log(response)
//         if (response.data.length > 0) {
//           setSelectedCategory(response?.data[0]._id);
//         }
//       } catch (err) {
//         console.error("Error fetching categories:", err);
//         setError(t("noExpenses"));
//       }
//     };

//     fetchCategories();
//   }, [t]);
  

  // Fetch expenses whenever selected category changes
  useEffect(() => {
    if (!selectedCategory) return;

    setLoading(true);

    const fetchContractExpenses = async (category) => {
      try {
        const userString = localStorage.getItem("user");
        const user = JSON.parse(userString);

        const response = await axios.get(
          `https://construction-cost-tracker-server-g2.vercel.app/api/expenses/contract/`,
          {
            params: { category,  },
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (Array.isArray(response.data.expenses)) {
          setExpenses(response.data.expenses);
        } else {
          throw new Error("API response does not contain an expenses array");
        }
      } catch (err) {
        setError(t("noExpenses"));
      } finally {
        setLoading(false);
      }
    };

    fetchContractExpenses(selectedCategory);
  }, [selectedCategory, t]);

  const handleAgreementAmountChange = (category, amount) => {
    setAgreementAmounts((prev) => ({ ...prev, [category]: amount }));
  };

  const calculateTotalExpense = () =>
    expenses.reduce((total, expense) => total + expense.amount, 0);

  const renderCategoryList = () =>
    categories.map((category) => (
      <div
        key={category._id}
        className={`cursor-pointer sm:text-lg text-sm mb-4 p-4 rounded-lg hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl ${
          selectedCategory === category._id
            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl"
            : "bg-gray-200 text-gray-800 shadow-md"
        }`}
        onClick={() => setSelectedCategory(category?._id)}
      >
        {category.name}
      </div>
    ));

  const renderExpenseDetails = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse space-y-2">
              <div className="h-6 bg-gray-300 rounded w-2/3"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      );
    }

    if (error) return <p className="text-red-500">{error}</p>;

    if (expenses.length === 0)
      return <p className="text-gray-500">{t("noExpenses")}</p>;

    const totalExpense = calculateTotalExpense();
    const agreementAmount = agreementAmounts[selectedCategory] || 5000;

    return (
      <>
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-300 hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-center mb-4">
            <p className="text-xl font-semibold text-gray-800">
              {t("totalExpenses")}: ${totalExpense}
            </p>
            <div>
              <label className="text-lg font-medium text-gray-700">
                {t("agreementAmount")}:
              </label>
              <input
                type="number"
                value={agreementAmount}
                onChange={(e) =>
                  handleAgreementAmountChange(selectedCategory, e.target.value)
                }
                className="border border-gray-300 rounded-lg p-3 w-32 mt-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder={t("enterAmount")}
              />
            </div>
          </div>

          <div className="w-full bg-gray-300 rounded-full h-2 mt-4">
            <div
              className={`h-2 rounded-full ${
                (totalExpense / agreementAmount) * 100 < 50
                  ? "bg-green-500"
                  : (totalExpense / agreementAmount) * 100 < 80
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{
                width: `${Math.min((totalExpense / agreementAmount) * 100, 100)}%`,
                transition: "width 0.3s ease",
              }}
            ></div>
          </div>

          <p className="mt-2 text-lg text-gray-700">
            {t("agreementAmount")}: ${agreementAmount} | {t("amount")}: ${totalExpense}
          </p>
          <p className="text-sm text-gray-500">
            {agreementAmount - totalExpense <= 0
              ? t("agreementReached")
              : `${t("remaining")}: $${agreementAmount - totalExpense}`}
          </p>
        </div>

        {expenses.map((expense) => (
          <div
            key={expense._id}
            className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-200 hover:shadow-xl transition-all duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              {expense.description}
            </h2>
            <p className="text-lg text-green-600">
              {t("amount")}: ${expense.amount}
            </p>
            <p className="text-gray-500">
              {t("date")}: {new Date(expense.date).toLocaleDateString()}
            </p>
            <h3 className="text-sm text-gray-700 mt-2">
              {t("category")}: {expense.category?.name || "Unknown Category"}
            </h3>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
     
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {t("contractExpenses")}
      </h1>

      {/* Category List */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {renderCategoryList()}
      </div>

      {/* Expenses */}
      {renderExpenseDetails()}
    </div>
  );
};

export default ContractExpensesPage;
