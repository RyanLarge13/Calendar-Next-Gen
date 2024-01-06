import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { colors } from "../constants.js";
import { AiFillFolder, AiFillCheckCircle } from "react-icons/ai";
import Color from "./Color";
import UserContext from "../context/UserContext.jsx";

const AddKanbanFolder = ({ folder, setFolders, folders }) => {
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

  return (
    <motion.div
      drag="x"
      dragSnapToOrigin="true"
      dragConstraints={{ left: 0 }}
      onDragEnd={endDrag}
      className={`flex justify-between items-center p-3 rounded-md shadow-md my-3 bg-opacity-20 ${color} relative`}
    >
      {editColor && (
        <div
          className={`absolute bottom-[110%] left-0 md:right-[50%] rounded-md shadow-md flex flex-wrap justify-center items-center gap-1 p-3 ${
            preferences.darkMode ? "bg-[#222]" : "bg-white"
          }`}
        >
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
      )}
      <button onContextMenu={() => setEditText(true)}>
        <p>{folder.title}</p>
      </button>
      {!!editColor ? (
        <button
          onClick={() => {
            setEditColor(false);
            editFolderColor();
          }}
        >
          <AiFillCheckCircle />
        </button>
      ) : (
        <button onClick={() => setEditColor(true)}>
          <AiFillFolder />
        </button>
      )}
    </motion.div>
  );
};

export default AddKanbanFolder;
