import React from "react";
import { Button } from "./ui/button";


const PaginationButton = ({ page, currentPage, onClick }) => {
  const isActive = page === currentPage;
  const buttonClass = isActive
    ? "bg-sky-50 text-sky-700 ring-1 ring-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:ring-sky-800"
    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60";

  return (
    <Button
      key={page}
      variant={isActive ? "default" : "outline"}
      onClick={() => onClick(page)}
      className={`group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${buttonClass}`}
    >
      {page}
    </Button>
  );
};

export default PaginationButton;
