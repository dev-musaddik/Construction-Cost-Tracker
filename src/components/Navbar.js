import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import {
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  LogOut,
  LayoutDashboard,
  Receipt,
  Wallet,
  Tags,
  Shield,
  Building2,
  User,
} from "lucide-react";

const NavItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      [
        "group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
        isActive
          ? "bg-sky-50 text-sky-700 ring-1 ring-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:ring-sky-800"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60",
      ].join(" ")
    }
  >
    {Icon && (
      <Icon className="h-4 w-4 opacity-80 transition group-hover:opacity-100" />
    )}
    <span>{label}</span>
  </NavLink>
);

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const userMenuRef = useRef(null);
  const mobileRef = useRef(null);
  // Define getInitial function
  function getInitial(name) {
    if (!name) return "";
    const parts = String(name).trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
    return (first + last).toUpperCase();
  }
// Sync the mobile menu state with localStorage
useEffect(() => {
  const storedMobileOpen = localStorage.getItem("mobileOpen");
  
  // If there's a value in localStorage, use it. If not, set the default to false (closed)
  setMobileOpen(storedMobileOpen === "true");
}, []); // This runs only on the initial render

// Update localStorage whenever mobileOpen state changes
useEffect(() => {
  localStorage.setItem("mobileOpen", mobileOpen);  // Save the current state of mobileOpen to localStorage
}, [mobileOpen]); // This runs whenever mobileOpen state changes


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Click outside to close user menu & mobile sheet
  useEffect(() => {
    const onClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        // allow clicks on the hamburger button itself
        const isToggler = e.target.closest?.("#mobile-menu-toggle");
        if (!isToggler) setMobileOpen(false);
      }
    };
    if (userMenuOpen || mobileOpen)
      document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [userMenuOpen, mobileOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const switchLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "bn" : "en");
  };

  const navLinks = [
    { to: "/dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { to: "/expenses", label: t("entries"), icon: Receipt },
    { to: "/deposits", label: t("deposits"), icon: Wallet },
    { to: "/categories", label: t("categories"), icon: Tags },
    { to: "/todos", label: t("todos"), icon: Tags },
    { to: "/contract", label: t("contract"), icon: Tags },
  ];

  return (
    <header
      className={[
        "sticky top-0 z-50 w-full border-b",
        scrolled
          ? "border-slate-200 bg-white/80 shadow-sm backdrop-blur supports-[backdrop-filter]:backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/70"
          : "border-transparent bg-white/60 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md dark:bg-slate-900/50",
      ].join(" ")}
      role="banner"
    >
      {/* top accent line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-sky-400 via-indigo-400 to-fuchsia-400 opacity-60" />

      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-3">
          {/* Left: Brand + Mobile Toggle */}
          <div className="flex items-center gap-2">
            <Button
              id="mobile-menu-toggle"
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

            <h1 className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
              <Link
                to="/"
                className="group inline-flex items-center gap-2 text-slate-900 dark:text-slate-100"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-sm ring-1 ring-white/40 dark:ring-black/20">
                  <Building2 className="h-4 w-4" />
                </span>
                <span className="leading-none">Construction Cost Tracker</span>
              </Link>
            </h1>
          </div>

          {/* Center: Desktop Nav */}
          <nav
            className="hidden lg:flex md:items-center md:gap-1"
            aria-label="Primary"
          >
            {user && (
              <ul className="flex items-center gap-1">
                {navLinks.map((l) => (
                  <li key={l.to}>
                    <NavItem to={l.to} icon={l.icon} label={l.label} />
                  </li>
                ))}
                {user?.role === "admin" && (
                  <li>
                    <NavItem
                      to="/admin/users"
                      icon={Shield}
                      label="Admin Panel"
                    />
                  </li>
                )}
              </ul>
            )}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center ">
            {/* Language */}
            <Button
              variant="ghost"
              size="sm"
              onClick={switchLanguage}
              className="inline-flex"
            >
              <Globe className="h-4 w-4" />
              <p className=" hidden sm:block">{i18n.language === "en" ? "বাংলা" : "English"}</p>
            </Button>

            {/* Theme */}
            {/* <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="relative"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle Theme</span>
            </Button> */}

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <Button
                  variant="outline"
                  className="inline-flex items-center gap-2"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={userMenuOpen}
                >
                  <span className="hidden text-sm text-slate-700 dark:text-slate-200 sm:inline">
                    {t("welcome", { defaultValue: "Welcome" })}, {user.name}
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700 ring-1 ring-white/50 dark:bg-slate-800 dark:text-slate-200 dark:ring-black/30">
                    {getInitial(user.name) || <User className="h-4 w-4" />}
                  </span>
                </Button>

                {/* User dropdown */}
                {userMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg ring-1 ring-black/5 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">
                      {t("signedInAs", { defaultValue: "Signed in as" })}
                      <div className="truncate font-medium text-slate-900 dark:text-slate-100">
                        {user.email || user.name}
                      </div>
                    </div>
                    <div className="my-1 h-px bg-slate-100 dark:bg-slate-800" />
                    <button
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" /> {t("logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link to="/login">
                  <Button size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" variant="outline">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sheet */}
      <div
        className={[
          "lg:hidden",
          mobileOpen === true ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
      >
        {/* overlay */}
        <div
          className={[
            "fixed inset-0 z-40 bg-black/30 transition-opacity",
            mobileOpen === true ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />

        {/* panel */}
        <aside
          ref={mobileRef}
          className={[
            "fixed inset-y-0 left-0 z-50 flex w-[80%] max-w-xs flex-col gap-2 border-r border-slate-200 bg-gray-500 p-4 shadow-xl transition-transform dark:border-slate-800",
            mobileOpen ? "translate-x-0" : "-translate-x-full", // Show/Hide based on mobileOpen state
          ].join(" ")}
          aria-label="Mobile navigation"
        >
          <div className="mb-2 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-sky-500 to-indigo-500 text-white shadow-sm">
                <Building2 className="h-4 w-4" />
              </span>
              Construction Cost Tracker
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="h-px w-full bg-gray-500" />

          {user ? (
            <ul className="mt-2 grid gap-1 bg-gray-500 p-4">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <NavItem to={l.to} icon={l.icon} label={l.label} />
                </li>
              ))}
              {user?.role === "admin" && (
                <li>
                  <NavItem
                    to="/admin/users"
                    icon={Shield}
                    label="Admin Panel"
                  />
                </li>
              )}
            </ul>
          ) : (
            <div className="mt-3 grid gap-2 bg-gray-500">
              <Link to="/login">
                <Button className="w-full">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="w-full" variant="outline">
                  Register
                </Button>
              </Link>
            </div>
          )}

          <div className="mt-auto space-y-2 pt-4 bg-gray-500 text-white">
            <Button
              variant="outline"
              className="w-full"
              onClick={switchLanguage}
            >
              <Globe className="mr-2 h-4 w-4" />{" "}
              {i18n.language === "en" ? "বাংলা" : "English"}
            </Button>
            {/* <Button variant="ghost" className="w-full" onClick={toggleTheme}>
              {theme === "dark" ? (
                <>
                  <Sun className="mr-2 h-4 w-4" /> Light Mode
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-4 w-4" /> Dark Mode
                </>
              )}
            </Button> */}
            {user && (
              <Button
                className="w-full"
                variant="destructive"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" /> {t("logout")}
              </Button>
            )}
          </div>
        </aside>
      </div>
    </header>
  );
}
