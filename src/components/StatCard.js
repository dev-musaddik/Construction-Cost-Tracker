import { useEffect, useState } from "react";

function formatValue(v) {
  if (typeof v === "number") {
    try {
      return new Intl.NumberFormat(undefined, {
        maximumFractionDigits: 2,
      }).format(v);
    } catch (e) {
      return String(v);
    }
  }
  return v;
}

function StatCard({
  label,
  value,
  highlight = false,
  allDataTotalBalance,
  loading,
}) {
  const [beforeBalance, setBeforeBalance] = useState();
  const showPrev =
    allDataTotalBalance !== undefined &&
    allDataTotalBalance !== null &&
    allDataTotalBalance !== "";

  useEffect(() => {
    if (!showPrev) return;

    // Check if value is a valid string or number before sanitizing
    if (!value || isNaN(value.replace(/[^\d.-]/g, ""))) {
      console.error("Invalid value:", value);
      return; // Avoid processing if value is invalid
    }

    // Remove the Taka symbol, spaces, and commas, then convert to a number
    const sanitizedValue = parseFloat(value.replace(/[^\d.-]/g, ""));

    // Log sanitized value to debug
    console.log("Sanitized value:", sanitizedValue);

    const computed = allDataTotalBalance - sanitizedValue;

    // Log computed value to debug
    console.log("Computed value:", computed);

    if (isNaN(computed)) {
      console.error("Computed value is NaN");
      return;
    }

    // Set the new beforeBalance if computed value is different
    setBeforeBalance((prev) => {
      if (prev === computed) return prev;
      return computed;
    });
  }, [showPrev, allDataTotalBalance, value]);

  const StatCardSkeleton = () => (
    <div className="bg-gray-200 animate-pulse h-24 rounded-lg p-4">
      <div className="h-6 bg-gray-300 w-1/2"></div>
    </div>
  );

  return (
    <div
      className={[
        "group relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-300",
        "bg-white/90 backdrop-blur hover:bg-white",
        highlight
          ? "border-sky-300 ring-2 ring-sky-200/70 hover:ring-sky-300/80"
          : "border-slate-200 hover:shadow-md",
      ].join(" ")}
      role="region"
      aria-label={`${label} stat`}
    >
      {/* subtle gradient wash */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50/80 via-transparent to-transparent" />
      </div>

      {/* decorative corner sparkle */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-sky-100/60 blur-2xl" />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500/90">
            {label}
          </div>
          {loading ? (
                <div className="mt-1.5 sm:text-3xl text-xl font-extrabold inline-block w-40 h-6 bg-gray-300 animate-pulse" />
          ) : (
            <div className="mt-1.5 sm:text-3xl text-xl font-extrabold leading-none tracking-tight text-slate-900">
              {formatValue(value)}
            </div>
          )}

          {(showPrev ) &&(
            <div className="mt-2 text-sm text-slate-600 flex items-center">
              <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-slate-300" />
              <span className="text-slate-500 mr-2">Before balance:</span>{" "}
              {loading ? (
                <div className="inline-block w-1/4 h-4 bg-gray-300 animate-pulse " />
              ) : (
                <span className="font-medium text-slate-700">
                  {beforeBalance}
                </span>
              )}
            </div>
          )}
        </div>

        {highlight && (
          <span
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600 ring-1 ring-inset ring-sky-200"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M5 12l5 5L20 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </div>

      {/* bottom divider accent */}
      <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
    </div>
  );
}

export default StatCard;
