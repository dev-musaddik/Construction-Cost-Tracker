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
import { fmtMoney } from "../../lib/utils";

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

// ---------- Recent Deposits ----------
function RecentDeposits({ deposits = [], maxItems = 20 }) {
  console.log(deposits)
  const { t } = useTranslation();

  const { grouped, total, count } = useMemo(() => {
    const total = deposits.reduce((s, d) => s + toNumber(d.amount), 0);
    const count = deposits.length;
    const groupedObj = groupByDay(deposits);
    const entries = Object.entries(groupedObj)
      .sort((a, b) => new Date(b[0]) - new Date(a[0]))
      .slice(0, maxItems);
    return { grouped: entries, total, count };
  }, [deposits, maxItems]);

  return (
    <section className="overflow-x-auto bg-[url('https://www.transparenttextures.com/patterns/lined-paper.png')] bg-repeat sm:p-6 p-2 font-[Patrick Hand,Comic Sans MS,cursive]">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-100 dark:text-slate-900 flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-emerald-700 ring-1 ring-inset ring-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-800 dark:ring-emerald-800">
              <PlusCircle className="h-4 w-4" />
            </span>
            {t("recentDeposits", { defaultValue: "Recent Deposits" })}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t("itemsCount", { defaultValue: "{{count}} items", count })} ·{" "}
            {t("total", { defaultValue: "Total" })}{" "}
            {fmtMoney(total)}
          </p>
        </div>
      </header>

      {deposits.length === 0 ? (
        <EmptyState
          title={t("noRecentDeposits", { defaultValue: "No recent deposits" })}
          subtitle={t("addADepositHint", {
            defaultValue:
              "When you add deposits, they’ll appear here grouped by date.",
          })}
          icon={<PlusCircle className="h-10 w-10 text-slate-300" />}
        />
      ) : (
        <div className="max-h-96 overflow-auto pr-1">
          {grouped.map(([key, { date, items }]) => (
            <div key={key} className="mb-4 last:mb-0">
              {/* Date Header */}
              <div className="mb-2 flex items-center gap-2 text-xs font-medium text-black/80">
                <CalendarDays className="h-4 w-4 text-black/80" />
                <span className="rounded-full bg-transparent backdrop-blur-md sm:px-2 px-1 py-0.5 border border-black/20">
                  {formatDate(date)}
                </span>
              </div>

              {/* Transparent List */}
              <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl ">
                {items.map((d, idx) => {
                  const dt = normalizeDate(d);
                  const id = d._id || `${key}-${idx}`;
                  return (
                    <li
                      key={id}
                      className="flex items-center justify-between gap-3 bg-transparent sm:px-3 px-1 py-3 transition hover:bg-rose-50/50 dark:bg-transparent dark:hover:bg-rose-900/10"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-black">
                          {d.description ||
                            t("deposit", { defaultValue: "Deposit" })}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-black/80">
                          <Clock className="h-3.5 w-3.5 text-black/80" />
                          <span>{formatTime(dt)}</span>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="text-sm font-semibold text-green-800">
                          +{fmtMoney(toNumber(d.amount))}
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
export default RecentDeposits;
