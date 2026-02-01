import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { colors } from "../constants.js";
import { AiFillFolder, AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import Color from "./Color";
import UserContext from "../context/UserContext.jsx";

const AddKanbanFolder = ({ folder, id, setFolders, folders }) => {
  const { preferences } = useContext(UserContext);

  const [editColor, setEditColor] = useState(false);
  const [editText, setEditText] = useState(false);
  const [color, setColor] = useState(folder.color);

  const editFolderColor = () => {
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
  }

  return (
<motion.div
  drag="x"
  dragSnapToOrigin="true"
  dragConstraints={{ left: 0 }}
  onDragEnd={endDrag}
  className={`
    relative flex justify-between items-center gap-3
    rounded-2xl border px-4 py-3 shadow-sm transition-all
    ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/7" : "bg-white border-black/10 hover:bg-black/[0.02]"}
  `}
>
  {/* Color popover */}
  {editColor && (
    <div
      className={`
        absolute bottom-[110%] left-0 z-50
        rounded-2xl border shadow-xl p-3
        max-w-[280px]
        ${preferences.darkMode ? "bg-[#161616]/95 border-white/10" : "bg-white/95 border-black/10"}
        backdrop-blur-md
      `}
    >
      <p className={`text-xs font-semibold mb-2 ${preferences.darkMode ? "text-white/70" : "text-slate-600"}`}>
        Folder color
      </p>

      <div className="flex flex-wrap justify-center items-center">
        {colors.map((col, index) => (
          <Color
            key={index}
            string={col.color}
            color={color}
            setColor={setColor}
            index={index}
          />
        ))}
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={() => {
            setEditColor(false);
            editFolderColor();
          }}
          className="
            rounded-2xl px-4 py-2 text-sm font-semibold text-white
            bg-gradient-to-tr from-red-500 to-rose-500
            shadow-md hover:shadow-lg hover:scale-[1.02]
            active:scale-[0.97] transition-all duration-200
          "
        >
          Save
        </button>
      </div>
    </div>
  )}

  {/* Left: color marker + title */}
  <button
    type="button"
    onContextMenu={() => setEditText(true)}
    className="flex items-center gap-3 text-left w-full outline-none"
  >
    {/* Color dot (uses your selected bg class) */}
    <span className={`${color} h-3.5 w-3.5 rounded-full ring-1 ring-black/10`} />

    <div className="flex flex-col">
      <p className={`text-sm font-semibold ${preferences.darkMode ? "text-white" : "text-slate-900"}`}>
        {folder.title}
      </p>
      <p className={`text-[11px] ${preferences.darkMode ? "text-white/50" : "text-slate-500"}`}>
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
        ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06]"}
        `}
      aria-label="Edit folder color"
    >
      <AiFillFolder className={`${preferences.darkMode ? "text-cyan-100" : "text-slate-700"} text-lg`} />
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
        ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06]"}
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
              ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-red-200/10" : "bg-black/[0.03] border-black/10 hover:bg-red-200"}
            `}
            aria-label="Edit folder color"
          >
            <AiFillCloseCircle className={`${preferences.darkMode ? "text-cyan-100" : "text-slate-700"} text-lg`} />
          </button>
</motion.div>

  );
};

export default AddKanbanFolder;
