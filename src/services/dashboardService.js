import axios from 'axios';
import authHeader from './auth-header';

/**
 * Base API client
 * - Uses Vite env (VITE_API_URL) when provided, falls back to localhost
 * - Keeps credentials for cookie-based auth
 */
const api = axios.create({
  baseURL: (import.meta?.env?.VITE_API_URL || 'https://construction-cost-tracker-server-g2.vercel.app') + '/api',
  withCredentials: true,
});

// Attach Authorization header if your app stores a token
api.interceptors.request.use((config) => {
  // Prefer your existing helper if available
  const hdrs = authHeader?.();
  if (hdrs && typeof hdrs === 'object') {
    config.headers = { ...(config.headers || {}), ...hdrs };
  }
  return config;
});

/**
 * Validates YYYY-MM-DD strings (simple check, not timezone-aware).
 */

// ✅ DO NOT use Date(...).toISOString() equality (breaks under TZ)
function isValidYMD(s) {
  if (typeof s !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  // Use UTC so local timezone won’t shift the calendar day
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
  dt.getUTCFullYear() === y &&
  dt.getUTCMonth() + 1 === m &&
  dt.getUTCDate() === d
  );
  }
/**
 * Build query params for the dashboard API.
 * Supports either a single day (date) OR a range (from/to), with optional filter.
 * Note: If your backend expects filter only (today|weekly|monthly), keep using it.
 * @param {Object} p
 * @param {'today'|'weekly'|'monthly'} [p.filter]
 * @param {string} [p.date]  - 'YYYY-MM-DD'
 * @param {string} [p.from]  - 'YYYY-MM-DD' (inclusive)
 * @param {string} [p.to]    - 'YYYY-MM-DD' (inclusive)
 */
export function buildDashboardParams({ filter, date, from, to } = {}) {
  const params = {};

  if (filter) params.filter = filter; // server-side computed windows

  if (date && (from || to)) {
    // Guard: forbid mixing single-day with range
    console.warn('[dashboard] Provide either `date` OR `from`/`to`, not both. Using single `date`.');
    from = undefined; // eslint-disable-line no-param-reassign
    to = undefined;   // eslint-disable-line no-param-reassign
  }

  if (date) {
    if (!isValidYMD(date)) throw new Error('Invalid `date` format. Use YYYY-MM-DD.',date);
    params.date = date;
  } else {
    if (from) {
      if (!isValidYMD(from)) throw new Error('Invalid `from` format. Use YYYY-MM-DD.',from);
      params.from = from;
    }
    if (to) {
      if (!isValidYMD(to)) throw new Error('Invalid `to` format. Use YYYY-MM-DD.',to);
      params.to = to;
    }
  }

  return params;
}

/**
 * Fetch dashboard data.
 * Server supports:
 *  - filter=today|weekly|monthly (rolling windows)
 *  - date=YYYY-MM-DD (single day)
 *  - from/to=YYYY-MM-DD (inclusive range)
 * @param {ReturnType<typeof buildDashboardParams>} params
 * @returns {Promise<{
 *   totalExpenses: number,
 *   totalDeposits: number,
 *   balance: number,
 *   expensesByCategory: { category: string, total: number }[],
 *   expensesOverTime: { _id: { year: number, month: number }, total: number }[],
 *   deposits: any[],
 *   expenses: any[],
 * }>}
 */
export function getDashboardData(params) {
  // The backend route is GET /api/dashboard
  return api.get('/dashboard', { params }).then((res) => res.data);
}

/**
 * Convenience wrappers for common time windows.
 */
export const DashboardAPI = {
  getAll: () => getDashboardData({}),
  getToday: () => getDashboardData(buildDashboardParams({ filter: 'today' })),
  getThisWeek: () => getDashboardData(buildDashboardParams({ filter: 'weekly' })),
  getThisMonth: () => getDashboardData(buildDashboardParams({ filter: 'monthly' })),
  getByDate: (date) => getDashboardData(buildDashboardParams({ date })),
  getByRange: (from, to) => getDashboardData(buildDashboardParams({ from, to })),
};

export default { getDashboardData, buildDashboardParams };
