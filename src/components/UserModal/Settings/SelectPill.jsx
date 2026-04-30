import React from "react";

const SelectPill = ({ value, options = [], onChange, preferences }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`
      max-w-[150px] rounded-2xl border px-3 py-2 text-xs font-semibold outline-none shadow-sm
      ${
        preferences.darkMode
          ? "bg-[#222]/90 border-white/10 text-white/80"
          : "bg-white border-black/10 text-slate-700"
      }
    `}
  >
    {options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
);

export default SelectPill;
