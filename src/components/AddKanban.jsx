import { useState, useContext } from "react";
import { colors } from "../constants.js";
import { createNewKanban } from "../utils/api.js";
import Color from "./Color";
import AddKanbanFolder from "./AddKanbanFolder";
import InteractiveContext from "../context/InteractiveContext";
import UserContext from "../context/UserContext";
import DatesContext from "../context/DatesContext";

const AddKanban = () => {
  const { setType, setShowCategory, setAddNewEvent, setMenu } =
    useContext(InteractiveContext);
  const { setSystemNotif, setKanbans, preferences } = useContext(UserContext);
  const { setOpenModal } = useContext(DatesContext);

  const [title, setTitle] = useState("");
  const [color, setColor] = useState("");
  const [folders, setFolders] = useState([]);
  const [folderName, setFolderName] = useState("");

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
      return setSystemNotif(newError);
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
      return setSystemNotif(newError);
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
    const newFolder = {
      title: folderName,
      color: "bg-slate-200",
      private: true,
    };
    setFolders((prev) => [...prev, newFolder]);
    setFolderName("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Kanban"
          value={title}
          className={`p-2 w-full focus:outline-none text-4xl bg-opacity-30 mt-5 bg-transparent ${
            preferences.darkMode ? "text-white" : "text-black"
          }`}
          onChange={(e) => setTitle(e.target.value)}
        />
      </form>
      <div className="flex flex-wrap justify-center items-center my-5">
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
      <p>Create folders within your project to hold your boards</p>
      <div>
        <form onSubmit={(e) => addFolder(e)}>
          <input
            placeholder="Folder name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className={`my-2 outline-none border-b p-3 bg-transparent rounded-sm ${
              preferences.darkMode ? "text-white" : "text-black"
            }`}
          />
        </form>
        <div>
          {folders.length > 0 &&
            folders.map((folder, index) => (
              <AddKanbanFolder
                key={index}
                folder={folder}
                setFolders={setFolders}
                folders={folders}
              />
            ))}
        </div>
      </div>
      <div className="text-center text-xs font-semibold absolute bottom-4 right-4 left-4 text-black">
        <button
          onClick={() => saveKanban()}
          className="w-full px-3 py-2 rounded-md shadow-md bg-gradient-to-r from-lime-200 to-green-200 underline"
        >
          save
        </button>
        <button
          onClick={() => {
            setType(null);
            setAddNewEvent(false);
          }}
          className="w-full px-3 mt-3 py-2 rounded-md shadow-md bg-gradient-to-tr from-red-200 to-rose-200 underline"
        >
          cancel
        </button>
      </div>
    </div>
  );
};

export default AddKanban;
