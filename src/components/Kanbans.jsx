import { useContext, useState } from "react";
import { AiFillFolder } from "react-icons/ai";
import Kanban from "./Kanban";
import UserContext from "../context/UserContext";

const Kanbans = () => {
  const { kanbans } = useContext(UserContext);

  const [kanbanView, setKanbanView] = useState(null);

  const openModalAndSetType = () => {};

  return (
    <div className={preferences.darkMode ? "text-white" : "text-slate-900"}>
      {kanbanView ? (
        <div
          className={`
        min-h-screen
        pt-20 px-3 md:px-6 lg:px-10
      `}
        >
          <div
            className={`
          mx-auto w-full max-w-6xl
          grid grid-cols-1 lg:grid-cols-[360px_1fr]
          gap-6
        `}
          >
            {/* Sidebar */}
            <aside
              className={`
            relative rounded-3xl border shadow-2xl overflow-hidden
            backdrop-blur-md
            ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-white/85 border-black/10"}
          `}
            >
              {/* Header */}
              <div
                className={`
              px-5 pt-5 pb-4
              border-b
              ${preferences.darkMode ? "border-white/10" : "border-black/10"}
            `}
              >
                <p
                  className={`text-[11px] font-semibold tracking-wide ${
                    preferences.darkMode ? "text-white/60" : "text-slate-500"
                  }`}
                >
                  Project
                </p>

                <h2 className="mt-1 text-xl font-semibold tracking-tight truncate">
                  {kanbanView.title}
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span
                    className={`
                  inline-flex items-center gap-2
                  px-3 py-1.5 rounded-2xl border text-[11px] font-semibold shadow-sm
                  ${preferences.darkMode ? "bg-white/5 border-white/10 text-white/70" : "bg-black/[0.03] border-black/10 text-slate-700"}
                `}
                  >
                    <span className="h-2 w-2 rounded-full bg-cyan-400" />
                    Project folders
                  </span>

                  <span
                    className={`
                  inline-flex items-center gap-2
                  px-3 py-1.5 rounded-2xl border text-[11px] font-semibold shadow-sm
                  ${preferences.darkMode ? "bg-white/5 border-white/10 text-white/70" : "bg-black/[0.03] border-black/10 text-slate-700"}
                `}
                  >
                    <span className="font-bold">
                      {kanbanView.folders.length}
                    </span>
                    folders
                  </span>
                </div>
              </div>

              {/* Folder list */}
              <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto scrollbar-hide">
                {kanbanView.folders.map((folder, index) => (
                  <button
                    key={index}
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
                        <p className="text-sm font-semibold truncate">
                          {folder.title}
                        </p>
                        <p
                          className={`text-[11px] mt-1 font-semibold ${
                            preferences.darkMode
                              ? "text-white/55"
                              : "text-slate-500"
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
                ))}
              </div>
            </aside>

            {/* Main content placeholder (your boards/folder view goes here) */}
            <main
              className={`
            rounded-3xl border shadow-2xl overflow-hidden
            backdrop-blur-md
            ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-white/85 border-black/10"}
          `}
            >
              <div
                className={`
              px-6 py-6
              ${preferences.darkMode ? "text-white/75" : "text-slate-700"}
            `}
              >
                <p className="text-sm font-semibold">
                  Select a folder on the left to view its boards.
                </p>
                <p
                  className={`text-xs mt-2 ${preferences.darkMode ? "text-white/55" : "text-slate-500"}`}
                >
                  This area is intentionally styled as your future “kanban
                  workspace”.
                </p>
              </div>
            </main>
          </div>
        </div>
      ) : (
        <div className="pt-20 px-3 md:px-6 lg:px-10">
          <div className="mx-auto w-full max-w-6xl">
            {/* Page header */}
            <div className="mb-6">
              <p
                className={`text-[11px] font-semibold tracking-wide ${
                  preferences.darkMode ? "text-white/60" : "text-slate-500"
                }`}
              >
                Kanban
              </p>
              <h2 className="text-2xl font-semibold tracking-tight">
                Your projects
              </h2>
            </div>

            {/* Grid */}
            <div
              className={`
            grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3
            gap-4 md:gap-6
          `}
            >
              {kanbans.length > 0 ? (
                kanbans.map((kanban) => (
                  <Kanban
                    kanban={kanban}
                    key={kanban.id}
                    setKanbanView={setKanbanView}
                  />
                ))
              ) : (
                <div
                  className={`
                col-span-full
                rounded-3xl border shadow-2xl p-6
                backdrop-blur-md
                flex items-center justify-between gap-4
                ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-white/85 border-black/10"}
              `}
                >
                  <div>
                    <h2 className="text-lg font-semibold">
                      Create a new project
                    </h2>
                    <p
                      className={`text-sm mt-1 ${preferences.darkMode ? "text-white/60" : "text-slate-500"}`}
                    >
                      Start organizing your boards with folders.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => openModalAndSetType()}
                    className={`
                  grid place-items-center h-12 w-12 rounded-2xl shadow-md transition active:scale-95
                  bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-500
                  text-white
                `}
                    aria-label="Create project"
                  >
                    <IoIosAddCircle className="text-2xl" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kanbans;
