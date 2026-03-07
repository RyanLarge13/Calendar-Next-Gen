import { useContext } from "react";
import UserContext from "../../context/UserContext";

const Switch = ({ title, styles, value, toggle }) => {
  const { preferences } = useContext(UserContext);

  return (
    <button
      onClick={() => toggle(!value)}
      className={`
        ${styles}
        flex w-full items-center justify-between gap-3
        rounded-3xl border shadow-sm px-4 py-3
        transition active:scale-[0.99]
        ${
          preferences.darkMode
            ? "bg-white/5 border-white/10 hover:bg-white/10"
            : "bg-white border-black/10 hover:bg-black/[0.02]"
        }
      `}
    >
      {/* Title */}
      <div className="flex items-center gap-3 min-w-0">{title}</div>

      {/* Switch */}
      <div
        className={`
          relative h-7 w-14 rounded-full border shadow-inner
          transition-colors duration-200 flex-shrink-0
          ${
            value
              ? preferences.darkMode
                ? "bg-cyan-500/25 border-cyan-300/20"
                : "bg-cyan-100 border-cyan-200"
              : preferences.darkMode
                ? "bg-white/10 border-white/10"
                : "bg-black/[0.05] border-black/10"
          }
        `}
      >
        {/* Thumb */}
        <div
          className={`
            absolute top-1 bottom-1 w-5 rounded-full shadow-md
            transition-all duration-200
            ${value ? "left-[calc(100%-1.5rem)]" : "left-1"}
            ${preferences.darkMode ? "bg-white" : "bg-white"}
          `}
        />
      </div>
    </button>
  );
};

export default Switch;
