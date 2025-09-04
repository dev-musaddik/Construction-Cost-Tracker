// Pro, responsive, and polished list cards for deposits & expenses
// Drop-in compatible with your current props, but with optional enhancements
// - TailwindCSS only; optional lucide-react icons for visuals
// - Groups items by date, shows totals, and formats amounts & times
// - Dark mode ready, keyboard-accessible, and mobile-friendly
//
// Usage:
// <RecentDeposits deposits={deposits} currency="USD" maxItems={10} />
// <RecentExpenses expenses={expenses} currency="USD" maxItems={10} />

import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PlusCircle, MinusCircle, CalendarDays, Clock } from "lucide-react";

// ---- Helpers ----
const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const normalizeDate = (item) =>
  new Date(item?.date || item?.createdAt || item?.updatedAt || Date.now());

const formatDate = (d, opts = {}) =>
  new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    ...opts,
  }).format(d);

const formatTime = (d) =>
  new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);

const formatCurrency = (amount, currency) => {
  try {
    if (currency) {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
      }).format(amount);
    }
    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount}`;
  }
};

const groupByDay = (items) => {
  const sorted = [...items].sort((a, b) => normalizeDate(b) - normalizeDate(a));
  return sorted.reduce((acc, it) => {
    const d = normalizeDate(it);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
    if (!acc[key]) acc[key] = { date: d, items: [] };
    acc[key].items.push(it);
    return acc;
  }, {});
};

const EmptyState = ({ title, subtitle, icon }) => (
  <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
    {icon}
    <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
      {title}
    </h3>
    <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
      {subtitle}
    </p>
  </div>
);
// ---------- Recent Expenses ----------
function RecentExpenses({ expenses = [], currency = "USD", maxItems = 20 }) {
  const { t } = useTranslation();

  const { grouped, total, count } = useMemo(() => {
    const total = expenses.reduce((s, e) => s + toNumber(e.amount), 0);
    const count = expenses.length;
    const groupedObj = groupByDay(expenses);
    const entries = Object.entries(groupedObj)
      .sort((a, b) => new Date(b[0]) - new Date(a[0]))
      .slice(0, maxItems);
    return { grouped: entries, total, count };
  }, [expenses, maxItems]);

  return (
    <section className="overflow-x-auto bg-[url('https://www.transparenttextures.com/patterns/lined-paper.png')] bg-repeat p-6 font-[Patrick Hand,Comic Sans MS,cursive]">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-100 dark:text-slate-900 flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500 text-rose-900 ring-1 ring-inset ring-rose-600 dark:bg-rose-900/30 dark:text-rose-800 dark:ring-rose-800">
              <MinusCircle className="h-4 w-4" />
            </span>
            {t("recentExpenses", { defaultValue: "Recent Expenses" })}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t("itemsCount", { defaultValue: "{{count}} items", count })} ·{" "}
            {t("total", { defaultValue: "Total" })}{" "}
            {formatCurrency(total, currency)}
          </p>
        </div>
      </header>

      {expenses.length === 0 ? (
        <EmptyState
          title={t("noRecentExpenses", { defaultValue: "No recent expenses" })}
          subtitle={t("addAnExpenseHint", {
            defaultValue:
              "When you add expenses, they’ll appear here grouped by date.",
          })}
          icon={<MinusCircle className="h-10 w-10 text-slate-300" />}
        />
      ) : (
        <div className="max-h-96 overflow-auto pr-1">
          {grouped.map(([key, { date, items }]) => (
            <div key={key} className="mb-4 last:mb-0">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                <CalendarDays className="h-4 w-4" />
                <span className="rounded-full bg-slate-100 px-2 py-0.5 dark:bg-slate-800">
                  {formatDate(date)}
                </span>
              </div>
              <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl ">
                {items.map((e, idx) => {
                  const dt = normalizeDate(e);
                  const id = e._id || `${key}-${idx}`;
                  return (
                    <li
                      key={id}
                      className="flex items-center justify-between gap-3 bg-transparent px-3 py-3 transition hover:bg-rose-50/50 dark:bg-transparent dark:hover:bg-rose-900/10"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-100 dark:text-slate-800">
                          {e.description ||
                            t("expense", { defaultValue: "Expense" })}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{formatTime(dt)}</span>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="text-sm font-semibold text-rose-800 dark:text-rose-400">
                          -{formatCurrency(toNumber(e.amount), currency)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default RecentExpenses;
