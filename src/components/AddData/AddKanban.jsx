import { useContext, useRef, useState } from "react";
import { BsFillCalendarPlusFill } from "react-icons/bs";
import { MdFreeCancellation } from "react-icons/md";
import { colors } from "../../constants.js";
import DatesContext from "../../context/DatesContext.jsx";
import InteractiveContext from "../../context/InteractiveContext.jsx";
import UserContext from "../../context/UserContext.jsx";
import { createNewKanban } from "../../utils/api.js";
import Color from "../Misc/Color";
import AddKanbanFolder from "./AddKanbanFolder.jsx";

const AddKanban = () => {
  const { setType, setShowCategory, setAddNewEvent, setMenu } =
    useContext(InteractiveContext);
  const { setSystemNotif, setKanbans, preferences } = useContext(UserContext);
  const { setOpenModal } = useContext(DatesContext);

  const [title, setTitle] = useState("");
  const [color, setColor] = useState("");
  const [folders, setFolders] = useState([]);
  const [folderName, setFolderName] = useState("");

  const folderNameRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const saveKanban = () => {
    if (!title) {
      const newError = {
        show: true,
        color: "bg-red-200",
        title: "Project Title",
        text: "Please add a title for your new Kanban project",
        hasCancel: false,
        actions: [
          { text: "close", func: () => setSystemNotif({ show: false }) },
        ],
      };
      setSystemNotif(newError);
      return;
    }
    if (!color) {
      const newError = {
        show: true,
        color: "bg-red-200",
        title: "Project Color",
        text: "Please select a color for your new Kanban project",
        hasCancel: false,
        actions: [
          { text: "close", func: () => setSystemNotif({ show: false }) },
        ],
      };
      setSystemNotif(newError);
      return;
    }
    const folderWithOrderSet = folders.map((folder, index) => {
      return { ...folder, order: index };
    });
    const newKanban = {
      title,
      color,
      folders: folderWithOrderSet,
    };
    const token = localStorage.getItem("authToken");
    if (token) {
      createNewKanban(token, newKanban)
        .then((res) => {
          console.log(res);
          setKanbans((prev) => [...prev, res.data.kanban]);
          setOpenModal(false);
          setAddNewEvent(false);
          setType(null);
          setMenu(true);
          setShowCategory("kanban");
        })
        .catch((err) => console.log(err));
    }
  };

  const addFolder = (e) => {
    e.preventDefault();

    const titleExists = folders.some((f) => f.title === folderName);

    if (titleExists) {
      const newError = {
        show: true,
        color: "bg-red-200",
        title: "Folder Name Taken",
        text: "You already have a folder with this name, please provide a new name",
        hasCancel: false,
        actions: [
          { text: "close", func: () => setSystemNotif({ show: false }) },
        ],
      };
      setSystemNotif(newError);
      return;
    }

    const newFolder = {
      title: folderName,
      color: "bg-slate-200",
      private: true,
    };
    setFolders((prev) => [...prev, newFolder]);
    setFolderName("");

    if (folderNameRef.current) {
      folderNameRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen flex justify-between flex-col pt-5">
      <div>
        <div className="relative px-3 min-h-[95%] sm:px-6 pt-16">
          {/* Title */}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Kanban"
              value={title}
              className={`
        w-full mt-2 mb-4 bg-transparent
        text-3xl sm:text-4xl font-semibold tracking-tight
        outline-none placeholder:opacity-60
        ${preferences.darkMode ? "text-white placeholder:text-gray-300" : "text-slate-900 placeholder:text-slate-500"}
      `}
              onChange={(e) => setTitle(e.target.value)}
            />
          </form>

          {/* Color picker */}
          <div className="flex flex-wrap justify-center items-center gap-1 py-2 mb-4">
            {colors.map((item, index) => (
              <Color
                key={index}
                string={item.color}
                color={color}
                setColor={setColor}
                index={index}
              />
            ))}
          </div>

          {/* Helper text */}
          <div
            className={`
      rounded-2xl border shadow-sm p-4 mb-4
      ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-white border-black/10"}
    `}
          >
            <p
              className={`text-sm font-semibold ${preferences.darkMode ? "text-white/80" : "text-slate-800"}`}
            >
              Organize your project
            </p>
            <p
              className={`text-xs mt-1 ${preferences.darkMode ? "text-white/60" : "text-slate-500"}`}
            >
              Create folders within your project to hold your boards.
            </p>
          </div>

          {/* Folder create + list */}
          <div
            className={`
      rounded-2xl border shadow-sm p-4
      ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-white border-black/10"}
    `}
          >
            <form onSubmit={(e) => addFolder(e)} className="mb-3">
              <input
                ref={folderNameRef}
                placeholder="Folder name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className={`
          w-full rounded-2xl border px-4 py-3 text-sm font-medium outline-none transition-all
          ${
            preferences.darkMode
              ? "bg-white/5 border-white/10 text-white placeholder:text-gray-300 focus:border-red-400/30 focus:ring-2 focus:ring-red-500/20"
              : "bg-white border-black/10 text-slate-900 placeholder:text-slate-500 focus:border-red-400/40 focus:ring-2 focus:ring-red-500/10"
          }
        `}
              />
              <p
                className={`text-[11px] mt-2 ${preferences.darkMode ? "text-white/50" : "text-slate-400"}`}
              >
                Tip: hit Enter to add
              </p>
            </form>

            <div className="space-y-2">
              {folders.length > 0 ? (
                folders.map((folder, index) => (
                  <div
                    key={index}
                    className={`
              rounded-2xl border shadow-sm transition-all
              ${preferences.darkMode ? "border-white/10 bg-white/5 hover:bg-white/7" : "border-black/10 bg-white hover:bg-black/[0.02]"}
            `}
                  >
                    {/* keep your existing folder component */}
                    <AddKanbanFolder
                      folder={folder}
                      id={index}
                      setFolders={setFolders}
                      folders={folders}
                    />
                  </div>
                ))
              ) : (
                <div className="py-8 text-center">
                  <p
                    className={`text-sm font-semibold ${preferences.darkMode ? "text-white/60" : "text-slate-500"}`}
                  >
                    No folders yet
                  </p>
                  <p
                    className={`text-xs mt-1 ${preferences.darkMode ? "text-white/40" : "text-slate-400"}`}
                  >
                    Add one above to get started.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex justify-between p-5 items-center w-full">
        <button
          onClick={() => {
            setType(null);
            setAddNewEvent(false);
          }}
          className="grid place-items-center rounded-2xl p-3 shadow-lg transition hover:scale-[0.98] active:scale-95 bg-gradient-to-tr from-red-500 to-rose-500 text-white"
          aria-label="Cancel"
        >
          <MdFreeCancellation className="text-xl" />
        </button>

        <button
          onClick={() => saveKanban()}
          className="grid place-items-center rounded-2xl p-3 shadow-lg transition hover:scale-[0.98] active:scale-95 bg-gradient-to-tr from-lime-400 to-emerald-500 text-white"
          aria-label="Add Kanban"
        >
          <BsFillCalendarPlusFill className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default AddKanban;
