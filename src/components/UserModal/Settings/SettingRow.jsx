import React from "react";

const SettingRow = ({ title, description, children, preferences }) => (
  <div
    className={`
      rounded-3xl border shadow-sm px-3 py-3
      flex items-center justify-between gap-4
      ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-black/[0.02] border-black/10"}
    `}
  >
    <div className="min-w-0">
      <p className="text-sm font-semibold">{title}</p>
      <p
        className={`text-[11px] font-semibold mt-0.5 ${
          preferences.darkMode ? "text-white/55" : "text-slate-500"
        }`}
      >
        {description}
      </p>
    </div>

    <div className="flex-shrink-0">{children}</div>
  </div>
);

export default SettingRow;
