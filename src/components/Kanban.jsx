import { useContext } from "react";
import {
  FaBell,
  FaEdit,
  FaFolder,
  FaFolderOpen,
  FaShareAlt,
  FaTrashAlt,
} from "react-icons/fa";
import UserContext from "../context/UserContext";

const Kanban = ({ kanban, setKanbanView }) => {
  const { user, preferences } = useContext(UserContext);

  return (
    <div
      onContextMenu={() => {}}
      className={`
        group relative w-full cursor-pointer
        rounded-3xl border shadow-sm overflow-hidden
        transition-all duration-200
        hover:shadow-md hover:scale-[1.01]
        ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-white/85 border-black/10"}
        backdrop-blur-md
      `}
    >
      {/* Left color rail */}
      <div
        className={`${kanban.color} absolute left-0 top-0 bottom-0 w-[10px]`}
      />

      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <p
              className={`text-[11px] font-semibold tracking-wide ${
                preferences.darkMode ? "text-white/60" : "text-slate-500"
              }`}
            >
              Kanban board
            </p>

            <h2 className="mt-1 text-lg font-semibold tracking-tight truncate pr-2">
              {kanban.title}
            </h2>
          </div>

          {/* Icon actions */}
          <div
            className={`
              flex items-center gap-2
              ${preferences.darkMode ? "text-white/55" : "text-slate-500"}
            `}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={`
                grid place-items-center h-9 w-9 rounded-2xl border shadow-sm transition active:scale-95
                ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06]"}
                hover:text-cyan-600
              `}
              aria-label="Share"
            >
              <FaShareAlt className="text-sm" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={`
                grid place-items-center h-9 w-9 rounded-2xl border shadow-sm transition active:scale-95
                ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06]"}
                hover:text-emerald-600
              `}
              aria-label="Edit"
            >
              <FaEdit className="text-sm" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={`
                grid place-items-center h-9 w-9 rounded-2xl border shadow-sm transition active:scale-95
                ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06]"}
                hover:text-amber-600
              `}
              aria-label="Notifications"
            >
              <FaBell className="text-sm" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
              }}
              className={`
                grid place-items-center h-9 w-9 rounded-2xl border shadow-sm transition active:scale-95
                ${preferences.darkMode ? "bg-rose-500/15 border-rose-300/20 hover:bg-rose-500/20 text-rose-100" : "bg-rose-50 border-rose-200 hover:bg-rose-100 text-rose-700"}
              `}
              aria-label="Delete"
            >
              <FaTrashAlt className="text-sm" />
            </button>
          </div>
        </div>

        {/* Meta chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          <div
            className={`
              inline-flex items-center gap-2
              px-3 py-1.5 rounded-2xl border text-[11px] font-semibold shadow-sm
              ${preferences.darkMode ? "bg-white/5 border-white/10 text-white/70" : "bg-black/[0.03] border-black/10 text-slate-700"}
            `}
          >
            <span className={`${kanban.color} h-2 w-2 rounded-full`} />
            Created{" "}
            {new Date(kanban.createdAt).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </div>

          <div
            className={`
              inline-flex items-center gap-2
              px-3 py-1.5 rounded-2xl border text-[11px] font-semibold shadow-sm
              ${preferences.darkMode ? "bg-white/5 border-white/10 text-white/70" : "bg-black/[0.03] border-black/10 text-slate-700"}
            `}
          >
            <span className="font-bold">{kanban.folders.length}</span>
            <FaFolder
              className={
                preferences.darkMode ? "text-white/50" : "text-slate-500"
              }
            />
            folders
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className={`
          px-5 py-4 flex justify-between items-center
          border-t
          ${preferences.darkMode ? "border-white/10" : "border-black/10"}
        `}
      >
        {/* Avatars */}
        <div className="flex items-center">
          <img
            src={user.avatarUrl}
            alt="you"
            className={`
              w-8 h-8 rounded-full border-2 shadow-sm
              ${preferences.darkMode ? "border-white/10" : "border-white"}
            `}
          />
          {kanban?.users?.map((usr, index) => (
            <img
              key={index}
              src={usr.avatarUrl}
              alt="associate"
              className={`
                w-8 h-8 rounded-full border-2 shadow-sm
                -ml-2
                ${preferences.darkMode ? "border-white/10" : "border-white"}
              `}
            />
          ))}
        </div>

        {/* Open */}
        <button
          type="button"
          onClick={() => setKanbanView(kanban)}
          className={`
            grid place-items-center h-10 w-10 rounded-2xl shadow-md transition active:scale-95
            bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-500
            text-white
          `}
          aria-label="Open board"
        >
          <FaFolderOpen className="text-base" />
        </button>
      </div>
    </div>
  );
};

export default Kanban;
