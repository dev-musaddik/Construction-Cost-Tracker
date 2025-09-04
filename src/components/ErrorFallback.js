import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

/**
 * A unique, friendly error view that ALSO shows a dashboard-like skeleton layout
 * so users understand what’s loading. Includes auto-retry countdown, copy-to-clipboard,
 * and optional callbacks for retry/home/report.
 */
export default function ErrorFallback({
  t = (s) => s,
  error = "",
  retrySeconds = 10000,
  onRetry,
  onGoHome,
  onReport, // optional: () => void
  showDetails = false,
}) {
  const [countdown, setCountdown] = useState(retrySeconds);
  const [detailsOpen, setDetailsOpen] = useState(showDetails);
  const safeRetry = () => (onRetry ? onRetry() : window.location.reload());
  const safeHome = () =>
    onGoHome ? onGoHome() : (window.location.href = "/");

  useEffect(() => {
    if (retrySeconds <= 0) return;
    if (countdown <= 0) return;
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown, retrySeconds]);

  useEffect(() => {
    if (retrySeconds > 0 && countdown === 0) {
      safeRetry();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown, retrySeconds]);

  const copyError = async () => {
    try {
      await navigator.clipboard.writeText(String(error ?? ""));
      alert(t("copied"));
    } catch (_) {
      // ignore
    }
  };

  return (
    <div className="container mx-auto p-6 min-h-[70vh] grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* LEFT: Friendly error card */}
      <section
        role="alert"
        aria-live="polite"
        className="relative bg-white/70 backdrop-blur border border-red-200 rounded-2xl shadow-xl p-8 flex flex-col justify-center items-center text-center"
      >
        {/* playful badge */}
        <div className="absolute -top-7 left-1/2 -translate-x-1/2">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-white grid place-items-center shadow-lg">
            <span className="text-xl" aria-hidden>⚠️</span>
          </div>
        </div>

        <h1 className="mt-6 text-2xl sm:text-3xl font-extrabold text-red-700">
          {t("somethingWentWrong") || "Something went wrong"}
        </h1>
        <p className="mt-2 text-sm text-red-600">
          {t("weHitASnag") || "We hit a snag while loading your dashboard."}
        </p>

        {/* Action row */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={safeRetry}
            className="px-5 py-2.5 rounded-xl font-semibold text-white shadow focus:outline-none focus:ring-2 focus:ring-red-400 bg-gradient-to-r from-red-600 to-rose-600 hover:opacity-95"
          >
            {t("retry") || "Retry"}
            {retrySeconds > 0 && countdown > 0 ? ` (${countdown})` : ""}
          </button>
          <button
            onClick={safeHome}
            className="px-5 py-2.5 rounded-xl font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 shadow focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            {t("goHome") || "Go Home"}
          </button>
          <button
            onClick={() => (onReport ? onReport() : copyError())}
            className="px-5 py-2.5 rounded-xl font-semibold bg-white border hover:bg-gray-50 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            {t("reportIssue") || "Report / Copy Error"}
          </button>
        </div>

        {/* Toggle details */}
        <div className="mt-4">
          <button
            onClick={() => setDetailsOpen((v) => !v)}
            className="text-xs underline text-gray-600 hover:text-gray-800"
          >
            {detailsOpen
              ? t("hideDetails") || "Hide details"
              : t("showDetails") || "Show details"}
          </button>
        </div>

        {detailsOpen && (
          <pre className="mt-3 max-h-40 overflow-auto text-left text-xs bg-red-50/80 border border-red-200 rounded-lg p-3 w-full">
            {String(error ?? "")}
          </pre>
        )}
      </section>

      {/* RIGHT: dashboard-like skeleton preview */}
      <section className="bg-white rounded-2xl shadow p-4 lg:p-6">
        <div className="space-y-6 animate-pulse">
          {/* Filters row */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <Skeleton className="h-9 w-full rounded-lg" />
            <Skeleton className="h-9 w-full rounded-lg" />
            <Skeleton className="h-9 w-full rounded-lg col-span-2 sm:col-span-1" />
            <Skeleton className="h-9 w-full rounded-lg" />
            <Skeleton className="h-9 w-full rounded-lg" />
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-10 rounded-xl" />
            <Skeleton className="h-10 rounded-xl" />
          </div>

          {/* Two big lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3 border rounded-xl p-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="space-y-3 border rounded-xl p-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
        </div>
      </section>
    </div>
  );
}
