import { useContext, useState } from "react";
import { motion } from "framer-motion";
import {
  AiFillFolder,
  AiFillCheckCircle,
  AiFillCloseCircle,
} from "react-icons/ai";
import UserContext from "../../context/UserContext.jsx";
import EditColor from "./EditColor.jsx";

const AddKanbanFolder = ({ folder, id, setFolders, folders }) => {
  const { preferences } = useContext(UserContext);

  const [editColor, setEditColor] = useState(false);
  const [editText, setEditText] = useState(false);
  const [color, setColor] = useState(folder.color);

  const editFolderColor = () => {
    setEditColor(false);
    const newFolders = folders.map((fold) => {
      if (fold.title === folder.title) {
        return { ...folder, color: color };
      }
      return fold;
    });
    setFolders(newFolders);
  };

  const endDrag = (e, info) => {
    const end = info.offset.x;
    if (end > 125) {
      const newFolders = folders.filter((fold) => fold.title !== folder.title);
      setFolders(newFolders);
    }
  };

  const removeFolder = () => {
    const newFolders = folders.filter((fold) => fold.title !== folder.title);
    setFolders(newFolders);
  };

  return (
    <motion.div
      drag="x"
      dragSnapToOrigin="true"
      dragConstraints={{ left: 0 }}
      onDragEnd={endDrag}
      className={`
    relative flex justify-between items-center gap-3
    rounded-2xl border px-4 py-3 shadow-sm transition-all
    ${
      preferences.darkMode
        ? "bg-white/5 border-white/10 hover:bg-white/7"
        : "bg-white border-black/10 hover:bg-black/[0.02]"
    }
  `}
    >
      {/* Color popover */}
      {editColor && (
        <EditColor save={editFolderColor} color={color} setColor={setColor} />
      )}

      {/* Left: color marker + title */}
      <button
        type="button"
        onContextMenu={() => setEditText(true)}
        className="flex items-center gap-3 text-left w-full outline-none"
      >
        {/* Color dot (uses your selected bg class) */}
        <span
          className={`${color} h-3.5 w-3.5 rounded-full ring-1 ring-black/10`}
        />

        <div className="flex flex-col">
          <p
            className={`text-sm font-semibold ${
              preferences.darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            {folder.title}
          </p>
          <p
            className={`text-[11px] ${
              preferences.darkMode ? "text-white/50" : "text-slate-500"
            }`}
          >
            Drag left to delete • Hold to rename
          </p>
        </div>
      </button>

      {/* Right: icon action */}

      {!editColor ? (
        <button
          type="button"
          onClick={() => setEditColor(true)}
          className={`
        grid place-items-center h-10 w-10 rounded-2xl border shadow-sm transition
        active:scale-95
        ${
          preferences.darkMode
            ? "bg-white/5 border-white/10 hover:bg-white/10"
            : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06]"
        }
        `}
          aria-label="Edit folder color"
        >
          <AiFillFolder
            className={`${
              preferences.darkMode ? "text-cyan-100" : "text-slate-700"
            } text-lg`}
          />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            setEditColor(false);
            editFolderColor();
          }}
          className={`
        grid place-items-center h-10 w-10 rounded-2xl border shadow-sm transition
        active:scale-95
        ${
          preferences.darkMode
            ? "bg-white/5 border-white/10 hover:bg-white/10"
            : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06]"
        }
        `}
          aria-label="Confirm folder color"
        >
          <AiFillCheckCircle className="text-emerald-500 text-xl" />
        </button>
      )}
      <button
        type="button"
        onClick={() => removeFolder()}
        className={`
              grid place-items-center h-10 w-10 rounded-2xl border shadow-sm transition
              active:scale-95
              ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10 hover:bg-red-200/10"
                  : "bg-black/[0.03] border-black/10 hover:bg-red-200"
              }
            `}
        aria-label="Edit folder color"
      >
        <AiFillCloseCircle
          className={`${
            preferences.darkMode ? "text-cyan-100" : "text-slate-700"
          } text-lg`}
        />
      </button>
    </motion.div>
  );
};

export default AddKanbanFolder;
