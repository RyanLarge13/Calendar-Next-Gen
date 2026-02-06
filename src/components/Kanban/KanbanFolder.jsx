import React, { useContext } from "react";
import UserContext from "../../context/UserContext";
import { AiFillFolder } from "react-icons/ai";

const KanbanFolder = ({ folder }) => {
  const { preferences } = useContext(UserContext);

  return (
    <button
      className={`
                  group relative w-full text-left
                  rounded-3xl border shadow-sm overflow-hidden
                  transition-all duration-200
                  hover:shadow-md hover:scale-[1.01]
                  ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-white border-black/10"}
                `}
    >
      {/* Left color rail */}
      <div
        className={`${folder.color} absolute left-0 top-0 bottom-0 w-[10px]`}
      />

      <div className="px-5 py-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{folder.title}</p>
          <p
            className={`text-[11px] mt-1 font-semibold ${
              preferences.darkMode ? "text-white/55" : "text-slate-500"
            }`}
          >
            Tap to open folder
          </p>
        </div>

        <div
          className={`
                      grid place-items-center h-10 w-10 rounded-2xl border shadow-sm transition
                      ${preferences.darkMode ? "bg-white/5 border-white/10 text-white/65 group-hover:bg-white/10" : "bg-black/[0.03] border-black/10 text-slate-600 group-hover:bg-black/[0.06]"}
                    `}
        >
          <AiFillFolder />
        </div>
      </div>
    </button>
  );
};

export default KanbanFolder;
