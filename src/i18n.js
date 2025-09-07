import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: "bn",
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          // Navbar
          dashboard: "Dashboard",
          categories: "Categories",
          entries: "Entries",
          deposits: "Deposits",
          profile: "Profile",
          logout: "Logout",
          welcome: "Welcome",

          // Login Page
          login: "Login",
          email: "Email",
          password: "Password",
          signIn: "Sign In",
          registerText: "Don't have an account? Register",
          failedToLogIn: "Failed to log in",

          // Register Page
          register: "Register",
          passwordsDoNotMatch: "Passwords do not match",
          failedToCreateAccount: "Failed to create an account",
          name: "Name",
          confirmPassword: "Confirm Password",
          alreadyHaveAccount: "Already have an account? Login",

          // Admin Users Page
          adminUsersPage: "Admin Users Page",
          adminOnly: "This page is only accessible by administrators.",

          // Categories Page
          failedToFetchCategories: "Failed to fetch categories",
          confirmDeleteCategory:
            "Are you sure you want to delete this category?",
          categoryDeletedSuccess: "Category deleted successfully",
          failedToDeleteCategory: "Failed to delete category",
          categoryUpdatedSuccess: "Category updated successfully",
          categoryAddedSuccess: "Category added successfully",
          failedToSaveCategory: "Failed to save category",
          loadingCategories: "Loading categories...",
          addCategory: "Add Category",
          noCategoriesFound: "No categories found.",
          actions: "Actions",

          // Dashboard Page
          selectADate: "Select a date",
          selectFromAndToDates: "Select FROM and TO dates",
          fromCannotBeAfterTo: "FROM cannot be after TO",
          mode: "Mode",
          singleDay: "Single Day",
          dateRange: "Date Range",
          date: "Date",
          from: "From",
          to: "To",
          allTime: "All Time",
          today: "Today",
          thisWeek: "This Week",
          thisMonth: "This Month",
          weekStarts: "Week starts",
          mon: "Mon",
          sun: "Sun",
          apply: "Apply",
          failedToFetchDashboardData: "Failed to fetch dashboard data",
          range: "Range",
          totalExpenses: "Total Expenses",
          totalDeposits: "Total Deposits",
          balance: "Balance",
          expensesByCategory: "Expenses by Category",
          noExpensesByCategory: "No expenses by category.",
          expensesOverTimeMonthly: "Expenses Over Time (Monthly)",
          noExpensesOverTime: "No expenses over time.",
          addDeposit: "Add Deposit",
          addExpense: "Add Expense",
          depositUpdated: "Deposit updated",
          depositAdded: "Deposit added",
          failedToSaveDeposit: "Failed to save deposit",
          expenseUpdated: "Expense updated",
          expenseAdded: "Expense added",
          failedToSaveExpense: "Failed to save expense",

          // Deposits Page
          failedToFetchDeposits: "Failed to fetch deposits",
          confirmDeleteDeposit: "Are you sure you want to delete this deposit?",
          depositDeletedSuccess: "Deposit deleted successfully",
          failedToDeleteDeposit: "Failed to delete deposit",
          depositUpdatedSuccess: "Deposit updated successfully",
          depositAddedSuccess: "Deposit added successfully",
          noDepositsFound: "No deposits found.",
          description: "Description",
          amount: "Amount",

          // Expenses Page
          expenses: "Expenses",
          exportCsv: "Export CSV",
          exportPdf: "Export PDF",
          exportExcel: "Export Excel",
          reset: "Reset",
          category: "Category",
          startDate: "Start Date",
          endDate: "End Date",
          sortBy: "Sort By",
          order: "Order",
          pageSize: "Page Size",
          categoryFilter: "Category Filter",
          sortOrder: "Sort Order",
          ascending: "Ascending",
          descending: "Descending",
          keyword: "Keyword",
          noExpensesFound: "No expenses found",
          startAddingExpenses: "Start adding expenses",
          edit: "Edit",
          delete: "Delete",
          notAvailable: "Not Available",
          expenseUpdatedSuccess: "Expense updated successfully",
          expenseAddedSuccess: "Expense added successfully",
          expenseDeletedSuccess: "Expense deleted successfully",
          confirmDeleteExpense: "Are you sure you want to delete this expense?",
          failedToFetchExpenses: "Failed to fetch expenses",
          failedToDeleteExpense: "Failed to delete expense",
          startAfterEndAdjusted:
            "Start date cannot be after end date. Adjusted automatically.",
          endBeforeStartAdjusted:
            "End date cannot be before start date. Adjusted automatically.",
          pdfExportNotImplemented: "PDF export is not implemented",
          excelExportNotImplemented: "Excel export is not implemented",

          // Profile Page
          profileUpdatedSuccess: "Profile updated successfully",
          failedToUpdateProfile: "Failed to update profile",
          dailyReportScheduledSuccess: "Daily report scheduled successfully!",
          failedToScheduleDailyReport: "Failed to schedule daily report.",
          userProfile: "User Profile",
          leaveBlankToKeepPassword: "Leave blank to keep current password",
          confirmNewPassword: "Confirm new password",
          updateProfile: "Update Profile",
          scheduledReports: "Scheduled Reports",
          scheduleDailyReportInfo:
            "Schedule a daily email report of your expenses.",
          scheduleDailyReport: "Schedule Daily Report",

          // Category Modal
          editCategory: "Edit Category",
          categoryName: "Category Name",
          cancel: "Cancel",
          saveChanges: "Save changes",

          // Deposit Modal
          pleaseFillInAllFields: "Please fill in all fields",
          pleaseEnterAValidAmount: "Please enter a valid amount greater than 0",
          editDeposit: "Edit Deposit",

          // Expense Modal
          failedToFetchCategoriesModal:
            "[ExpenseModal] Failed to fetch categories",
          missingDescription: "[ExpenseModal] Missing description",
          invalidAmount: "[ExpenseModal] Invalid amount",
          invalidDate: "[ExpenseModal] Invalid date, expected YYYY-MM-DD",
          missingCategory: "[ExpenseModal] Missing category",
          editExpense: "Edit Expense",
          expenseModalDescription:
            "Enter expense details, pick a category, and save.",
          selectACategory: "Select a category",
          save: "Save",
          total_expenses: "Total Expenses",
          current_page_expenses: "Current Page Expenses",

          //Contract page
          contractExpenses: "Contract Expenses",
          categories: "Categories",
          totalExpenses: "Total Expenses for this Category",
          agreementAmount: "Agreement Amount",
          enterAmount: "Enter Amount",
          agreementReached: "Agreement reached.",
          remaining: "Remaining",
          noExpenses: "No expenses found for this category.",
          amount: "Amount",
          date: "Date",
          category: "Category",
        },
      },
      bn: {
        translation: {
          // Navbar
          dashboard: "ড্যাশবোর্ড",
          categories: "বিভাগ",
          entries: "খরচ",
          deposits: "জমা",
          profile: "প্রোফাইল",
          logout: "প্রস্থান",
          welcome: "স্বাগতম",

          // Login Page
          login: "লগইন",
          email: "ইমেইল",
          password: "পাসওয়ার্ড",
          signIn: "সাইন ইন",
          registerText: "অ্যাকাউন্ট নেই? নিবন্ধন করুন",
          failedToLogIn: "লগ ইন করতে ব্যর্থ",

          // Register Page
          register: "নিবন্ধন করুন",
          passwordsDoNotMatch: "পাসওয়ার্ড মেলে না",
          failedToCreateAccount: "অ্যাকাউন্ট তৈরি করতে ব্যর্থ হয়েছে",
          name: "নাম",
          confirmPassword: "পাসওয়ার্ড নিশ্চিত করুন",
          alreadyHaveAccount: "ইতিমধ্যে একটি অ্যাকাউন্ট আছে? লগইন করুন",

          // Admin Users Page
          adminUsersPage: "প্রশাসক ব্যবহারকারী পৃষ্ঠা",
          adminOnly: "এই পৃষ্ঠাটি শুধুমাত্র প্রশাসকদের দ্বারা অ্যাক্সেসযোগ্য।",

          // Categories Page
          failedToFetchCategories: "বিভাগ আনতে ব্যর্থ হয়েছে",
          confirmDeleteCategory:
            "আপনি কি নিশ্চিত যে আপনি এই বিভাগটি মুছে ফেলতে চান?",
          categoryDeletedSuccess: "বিভাগ সফলভাবে মুছে ফেলা হয়েছে",
          failedToDeleteCategory: "বিভাগ মুছে ফেলতে ব্যর্থ হয়েছে",
          categoryUpdatedSuccess: "বিভাগ সফলভাবে আপডেট করা হয়েছে",
          categoryAddedSuccess: "বিভাগ সফলভাবে যোগ করা হয়েছে",
          failedToSaveCategory: "বিভাগ সংরক্ষণ করতে ব্যর্থ হয়েছে",
          loadingCategories: "বিভাগ লোড হচ্ছে...",
          addCategory: "বিভাগ যোগ করুন",
          noCategoriesFound: "কোন বিভাগ পাওয়া যায়নি।",
          actions: "কর্ম",

          // Dashboard Page
          selectADate: "একটি তারিখ নির্বাচন করুন",
          selectFromAndToDates: "থেকে এবং পর্যন্ত তারিখ নির্বাচন করুন",
          fromCannotBeAfterTo: "শুরুর তারিখ শেষের তারিখের পরে হতে পারে না",
          mode: "মোড",
          singleDay: "একক দিন",
          dateRange: "তারিখ পরিসীমা",
          date: "তারিখ",
          from: "থেকে",
          to: "পর্যন্ত",
          allTime: "সর্বদা",
          today: "আজ",
          thisWeek: "এই সপ্তাহ",
          thisMonth: "এই মাস",
          weekStarts: "সপ্তাহ শুরু",
          mon: "সোম",
          sun: "রবি",
          apply: "প্রয়োগ করুন",
          failedToFetchDashboardData: "ড্যাশবোর্ড ডেটা আনতে ব্যর্থ হয়েছে",
          range: "পরিসীমা",
          totalExpenses: "মোট খরচ",
          totalDeposits: "মোট আমানত",
          balance: "ব্যালেন্স",
          expensesByCategory: "বিভাগ দ্বারা খরচ",
          noExpensesByCategory: "বিভাগ দ্বারা কোন খরচ নেই।",
          expensesOverTimeMonthly: "সময়ের সাথে খরচ (মাসিক)",
          noExpensesOverTime: "সময়ের সাথে কোন খরচ নেই।",
          addDeposit: "আমানত যোগ করুন",
          addExpense: "খরচ যোগ করুন",
          depositUpdated: "আমানত আপডেট করা হয়েছে",
          depositAdded: "আমানত যোগ করা হয়েছে",
          failedToSaveDeposit: "আমানত সংরক্ষণ করতে ব্যর্থ হয়েছে",
          expenseUpdated: "খরচ আপডেট করা হয়েছে",
          expenseAdded: "খরচ যোগ করা হয়েছে",
          failedToSaveExpense: "খরচ সংরক্ষণ করতে ব্যর্থ হয়েছে",

          // Deposits Page
          failedToFetchDeposits: "আমানত আনতে ব্যর্থ হয়েছে",
          confirmDeleteDeposit:
            "আপনি কি নিশ্চিত যে আপনি এই আমানতটি মুছে ফেলতে চান?",
          depositDeletedSuccess: "আমানত সফলভাবে মুছে ফেলা হয়েছে",
          failedToDeleteDeposit: "আমানত মুছে ফেলতে ব্যর্থ হয়েছে",
          depositUpdatedSuccess: "আমানত সফলভাবে আপডেট করা হয়েছে",
          depositAddedSuccess: "আমানত সফলভাবে যোগ করা হয়েছে",
          noDepositsFound: "কোন আমানত পাওয়া যায়নি।",
          amount: "পরিমাণ",

          // Expenses Page
          expenses: "ব্যয়",
          exportCsv: "CSV রপ্তানি করুন",
          exportPdf: "PDF রপ্তানি করুন",
          exportExcel: "Excel রপ্তানি করুন",
          reset: "রিসেট",
          category: "বিভাগ",
          startDate: "শুরু তারিখ",
          endDate: "শেষ তারিখ",
          sortBy: "সাজানোর মান",
          order: "অর্ডার",
          pageSize: "প্রতি পৃষ্ঠায়",
          description: "বর্ণনা",
          categoryFilter: "বিভাগ ফিল্টার",
          sortOrder: "সাজানোর অর্ডার",
          ascending: "উর্ধ্বমুখী",
          descending: "অবতীর্ণ",
          keyword: "কীওয়ার্ড",
          noExpensesFound: "কোনো ব্যয় পাওয়া যায়নি",
          startAddingExpenses: "ব্যয় যোগ করা শুরু করুন",
          edit: "সম্পাদনা করুন",
          delete: "মুছে ফেলুন",
          notAvailable: "উপলব্ধ নয়",
          expenseUpdatedSuccess: "ব্যয় সফলভাবে আপডেট হয়েছে",
          expenseAddedSuccess: "ব্যয় সফলভাবে যোগ হয়েছে",
          expenseDeletedSuccess: "ব্যয় সফলভাবে মুছে ফেলা হয়েছে",
          confirmDeleteExpense: "আপনি কি নিশ্চিত যে এই ব্যয়টি মুছে ফেলতে চান?",
          failedToFetchExpenses: "ব্যয়গুলি আনতে ব্যর্থ হয়েছে",
          failedToDeleteExpense: "ব্যয় মুছে ফেলতে ব্যর্থ হয়েছে",
          startAfterEndAdjusted:
            "শুরু তারিখ শেষ তারিখের পরে হতে পারে না। স্বয়ংক্রিয়ভাবে সামঞ্জস্য করা হয়েছে।",
          endBeforeStartAdjusted:
            "শেষ তারিখ শুরু তারিখের আগে হতে পারে না। স্বয়ংক্রিয়ভাবে সামঞ্জস্য করা হয়েছে।",
          pdfExportNotImplemented: "PDF রপ্তানি বাস্তবায়িত হয়নি",
          excelExportNotImplemented: "Excel রপ্তানি বাস্তবায়িত হয়নি",

          // Profile Page
          profileUpdatedSuccess: "প্রোফাইল সফলভাবে আপডেট করা হয়েছে",
          failedToUpdateProfile: "প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে",
          dailyReportScheduledSuccess:
            "দৈনিক প্রতিবেদন সফলভাবে নির্ধারিত হয়েছে!",
          failedToScheduleDailyReport:
            "দৈনিক প্রতিবেদন নির্ধারণ করতে ব্যর্থ হয়েছে।",
          userProfile: "ব্যবহারকারীর প্রোফাইল",
          leaveBlankToKeepPassword: "বর্তমান পাসওয়ার্ড রাখতে খালি রাখুন",
          confirmNewPassword: "নতুন পাসওয়ার্ড নিশ্চিত করুন",
          updateProfile: "প্রোফাইল আপডেট করুন",
          scheduledReports: "নির্ধারিত প্রতিবেদন",
          scheduleDailyReportInfo:
            "আপনার খরচের একটি দৈনিক ইমেল প্রতিবেদন নির্ধারণ করুন।",
          scheduleDailyReport: "দৈনিক প্রতিবেদন নির্ধারণ করুন",

          // Category Modal
          editCategory: "বিভাগ সম্পাদনা করুন",
          categoryName: "বিভাগের নাম",
          cancel: "বাতিল করুন",
          saveChanges: "পরিবর্তন সংরক্ষণ করুন",

          // Deposit Modal
          pleaseFillInAllFields: "অনুগ্রহ করে সমস্ত ক্ষেত্র পূরণ করুন",
          pleaseEnterAValidAmount:
            "অনুগ্রহ করে ০ এর বেশি একটি বৈধ পরিমাণ লিখুন",
          editDeposit: "আমানত সম্পাদনা করুন",

          // Expense Modal
          failedToFetchCategoriesModal:
            "[ExpenseModal] বিভাগ আনতে ব্যর্থ হয়েছে",
          missingDescription: "[ExpenseModal] বিবরণ অনুপস্থিত",
          invalidAmount: "[ExpenseModal] অবৈধ পরিমাণ",
          invalidDate: "[ExpenseModal] অবৈধ তারিখ, প্রত্যাশিত YYYY-MM-DD",
          missingCategory: "[ExpenseModal] বিভাগ অনুপস্থিত",
          editExpense: "খরচ সম্পাদনা করুন",
          expenseModalDescription:
            "খরচের বিবরণ লিখুন, একটি বিভাগ বাছুন এবং সংরক্ষণ করুন।",
          selectACategory: "একটি বিভাগ নির্বাচন করুন",
          save: "সংরক্ষণ করুন",

          //Recent Expense Page
          total: "মোট",
          itemsCount: "পণ্যের সংখ্যা",
          addADepositHint: "ডিপোজিট যোগ করার নির্দেশনা",
          total_expenses: "মোট খরচ",
          current_page_expenses: "বর্তমান পৃষ্ঠা খরচ",

          // Contract page

          contractExpenses: "চুক্তির খরচ",
          categories: "বিভাগসমূহ",
          totalExpenses: "এই বিভাগের মোট খরচ",
          agreementAmount: "চুক্তি রাশি",
          enterAmount: "রাশি লিখুন",
          agreementReached: "চুক্তি সম্পন্ন হয়েছে।",
          remaining: "বাকি",
          noExpenses: "এই বিভাগের জন্য কোনো খরচ পাওয়া যায়নি।",
          amount: "পরিমাণ",
          date: "তারিখ",
          category: "বিভাগ",
        },
      },
    },
  });

export default i18n;
