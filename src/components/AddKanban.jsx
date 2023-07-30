import { useState, useContext } from "react";
import { colors } from "../constants.js";
import { MdCancel } from "react-icons/md";
import { BsFillSaveFill } from "react-icons/bs";
import InteractiveContext from "../context/InteractiveContext";
import UserContext from "../context/UserContext";

const AddKanban = () => {
  const { setType, setAddNewEvent } = useContext(InteractiveContext);
  const { setSystemNotif } = useContext(UserContext);

  const [title, setTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

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
        actions: [
          { text: "close", func: () => setSystemNotif({ show: false }) },
        ],
      };
      return setSystemNotif(newError)
    }
    if (!selectedColor) {
      const newError = {
        show: true,
        color: "bg-red-200",
        title: "Project Color",
        text: "Please select a color for your new Kanban project",
        actions: [
          { text: "close", func: () => setSystemNotif({ show: false }) },
        ],
      };
      return setSystemNotif(newError);
    }
  };

  return (
    <div className="p-3">
      <p>Name your kanban project and begin!</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          className={`${selectedColor} p-3 mt-10 text-center rounded-md shadow-md bg-opacity-30`}
          onChange={(e) => setTitle(e.target.value)}
        />
      </form>
      <div className="mt-10 flex flex-wrap justify-center items-center gap-3">
        {colors.map((color) => (
          <div
            className={`${color.color} ${
              color.color === selectedColor ? "outline" : ""
            } w-10 h-10 rounded-md shadow-md`}
            onClick={() =>
              setSelectedColor((prev) =>
                prev === color.color ? "" : color.color
              )
            }
          ></div>
        ))}
      </div>
      <div className="fixed right-[65vw] bottom-5 flex flex-col justify-center items-center px-2">
        <button
          onClick={() => {
            setType(null);
            setAddNewEvent(false);
          }}
          className="p-3 rounded-full shadow-md bg-gradient-to-r from-red-300 to-red-200"
        >
          <MdCancel />
        </button>
        <button
          onClick={() => saveKanban()}
          className="rounded-full p-3 shadow-md bg-gradient-to-r from-green-300 to-green-200 mt-5"
        >
          <BsFillSaveFill />
        </button>
      </div>
    </div>
  );
};

export default AddKanban;
