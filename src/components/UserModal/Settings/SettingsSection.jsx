import React from "react";

const SettingsSection = ({
  title,
  description,
  badge,
  children,
  preferences,
}) => (
  <div
    className={`
      rounded-3xl border shadow-sm p-4
      ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-white border-black/10"}
    `}
  >
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p
          className={`text-xs mt-1 ${
            preferences.darkMode ? "text-white/55" : "text-slate-500"
          }`}
        >
          {description}
        </p>
      </div>

      {badge && (
        <div
          className={`
            text-[11px] font-semibold px-3 py-1.5 rounded-2xl border shadow-sm
            ${preferences.darkMode ? "bg-white/5 border-white/10 text-white/70" : "bg-black/[0.03] border-black/10 text-slate-600"}
          `}
        >
          {badge}
        </div>
      )}
    </div>

    <div className="mt-4 space-y-3">{children}</div>
  </div>
);

export default SettingsSection;
