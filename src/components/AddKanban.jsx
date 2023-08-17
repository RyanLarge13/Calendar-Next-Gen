import { useState, useContext } from "react";
import { colors } from "../constants.js";
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
        hasCancel: false,
        actions: [
          { text: "close", func: () => setSystemNotif({ show: false }) },
        ],
      };
      return setSystemNotif(newError);
    }
    if (!selectedColor) {
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
      <div className="flex flex-col w-full gap-y-5 mb-5 mt-10 text-center text-xs font-semibold">
        <button
          onClick={() => saveKanban()}
          className="px-3 py-2 rounded-md shadow-md bg-gradient-to-r from-lime-200 to-green-200 underline"
        >
          save
        </button>
        <button
          onClick={() => {
            setType(null);
            setAddNewEvent(false);
          }}
          className="px-3 py-2 rounded-md shadow-md bg-gradient-to-tr from-red-200 to-rose-200 underline"
        >
          cancel
        </button>
      </div>
    </div>
  );
};

export default AddKanban;
