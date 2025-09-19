import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { ymdLocal } from "../../lib/utils";

// ----------------------------- DateFilterBar ------------------------------
function DateFilterBar({ onApply, onPreset, preset, loading }) {
  const { t } = useTranslation();
  const [mode, setMode] = useState("day"); // 'day' | 'range'
  const [date, setDate] = useState(ymdLocal()); // default only once
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  console.log("Current State:", { mode, date, from, to });

  // ❌ REMOVE this effect; it re-injects "today" after you clear `date` for range
  // useEffect(() => {
  //   if (!date) setDate(ymdLocal());
  // }, [date]);

  const apply = () => {
    if (mode === "day") {
      if (!date) return toast.error(t("selectADate"));
      onApply({ date, from: "", to: "" });
    } else {
      if (!from || !to) return toast.error(t("selectFromAndToDates"));
      if (from > to) return toast.error(t("fromCannotBeAfterTo"));
      onApply({ date: "", from, to });
    }
  };

  const handlePreset = (presetValue) => {
    if (preset === presetValue) {
      onPreset(presetValue);
      console.log(`Preset "${presetValue}" is already selected. Skipping.`);
      return;
    }
    console.log(`Preset selected: ${presetValue}`);

    const now = new Date();

    if (presetValue === "today") {
      const today = ymdLocal();
      setMode("day");
      setDate(today);
      setFrom("");
      setTo("");
      onApply({ date: today, from: "", to: "" });
    } else if (presetValue === "all") {
      setMode("day");
      setDate("");
      setFrom("");
      setTo("");
      onApply({ date: "", from: "", to: "" });
    } else if (presetValue === "weekly") {
      const start = getStartOfWeek(new Date(now));
      const end = getEndOfWeek(new Date(now));
      setMode("range");
      setDate(""); // IMPORTANT: clear date so single-day filter won't run
      setFrom(start);
      setTo(end);
      onApply({ date: "", from: start, to: end });
    } else if (presetValue === "monthly") {
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .slice(0, 10);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        .toISOString()
        .slice(0, 10);
      setMode("range");
      setDate(""); // IMPORTANT
      setFrom(start);
      setTo(end);
      onApply({ date: "", from: start, to: end });
    }
  };

  const getStartOfWeek = (d) => {
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    d.setDate(diff);
    return d.toISOString().slice(0, 10);
  };

  const getEndOfWeek = (d) => {
    const day = d.getDay();
    const diff = d.getDate() + (day === 0 ? 0 : 7 - day); // Sunday end
    d.setDate(diff);
    return d.toISOString().slice(0, 10);
  };

  const presetBtn = (label, value, onClick) => (
    <Button
      loading={loading}
      text={label}
      type="button"
      // keep base look via variant; Tailwind will override styles when active
      variant={preset === value ? "default" : "outline"}
      onClick={onClick}
      data-active={preset === value ? "true" : "false"}
      aria-pressed={preset === value}
      className={[
        "flex-1 min-w-[80px] w-full sm:w-auto transition-colors",
        // highlight when active:
        "data-[active=true]:bg-blue-600 data-[active=true]:text-white data-[active=true]:border-blue-600",
        // (optional) support aria as well:
        "aria-[pressed=true]:bg-blue-600 aria-[pressed=true]:text-white aria-[pressed=true]:border-blue-600",
      ].join(" ")}
    >
      {label}
    </Button>
  );

  return (
    <div className="bg-white shadow-md rounded p-4 mb-4 flex flex-col md:flex-wrap md:flex-row gap-3 items-start md:items-end">
      <div className="flex gap-3 items-center flex-wrap">
        <span className="text-sm font-medium">{t("mode")}:</span>
        <div className="flex gap-2 flex-wrap">
          <Button
            loading={loading}
            text={t("singleDay")}
            type="button"
            variant={mode === "day" ? "default" : "outline"}
            onClick={() => setMode("day")}
          >
            {t("singleDay")}
          </Button>
          <Button
            loading={loading}
            text={t("dateRange")}
            type="button"
            variant={mode === "range" ? "default" : "outline"}
            onClick={() => setMode("range")}
          >
            {t("dateRange")}
          </Button>
        </div>
      </div>

      {mode === "day" ? (
        <div className="flex items-end gap-2 flex-wrap w-full md:w-auto">
          <div className="flex-1 md:flex-none">
            <label className="block text-sm">{t("date")}</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
        </div>
      ) : (
        <div className="flex items-end gap-2 flex-wrap w-full md:w-auto">
          <div className="flex-1 md:flex-none">
            <label className="block text-sm">{t("from")}</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div className="flex-1 md:flex-none">
            <label className="block text-sm">{t("to")}</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            />
          </div>
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-4 w-full justify-start">
        <div className="flex flex-wrap gap-2">
          {presetBtn(t("allTime"), "all", () => handlePreset("all"))}
          {presetBtn(t("today"), "today", () => handlePreset("today"))}
          {presetBtn(t("thisWeek"), "weekly", () => handlePreset("weekly"))}
          {presetBtn(t("thisMonth"), "monthly", () => handlePreset("monthly"))}
          <Button
          loading={loading}
          text={t("apply")}
          type="button"
          variant="apply"
          onClick={apply}
        >
          {t("apply")}
        </Button>
        </div>
        
      </div>
    </div>
  );
}

export default DateFilterBar;
