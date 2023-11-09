import { useState, useContext, useCallback } from "react";
import { colors } from "../constants.js";
import { addNewSticky } from "../utils/api.js";
import { AiFillInfoCircle } from "react-icons/ai";
import Color from "./Color";
import InteractiveContext from "../context/InteractiveContext";
import UserContext from "../context/UserContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Toggle from "./Toggle";

const AddSticky = () => {
  const { stickies, setStickies, setSystemNotif } = useContext(UserContext);
  const { setType, setAddNewEvent } = useContext(InteractiveContext);

  const [title, setTitle] = useState("");
  const [color, setColor] = useState("");
  const [text, setText] = useState("");
  const [pin, setPin] = useState(false);

  const handleTextChange = (value) => {
    setText(value);
  };

  const addSticky = () => {
    if (!runCheck()) return;
    const token = localStorage.getItem("authToken");
    if (token) {
      const newSticky = {
        title,
        body: text,
        color,
        pin,
      };
      addNewSticky(token, newSticky)
        .then((res) => {
          console.log(res);
          setStickies((prev) => [res.data.sticky, ...prev]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const runCheck = () => {
    if (!title) {
      const newError = {
        show: true,
        title: "Title",
        text: "Please add a title to your new sticky note",
        color: "bg-red-200",
        hasCancel: false,
        actions: [
          { text: "close", func: () => setSystemNotif({ show: false }) },
        ],
      };
      setSystemNotif(newError);
      return false;
    }
    if (!color) {
      const newError = {
        show: true,
        title: "Color",
        text: "Please add a color to your new sticky note",
        color: "bg-red-200",
        hasCancel: false,
        actions: [
          { text: "close", func: () => setSystemNotif({ show: false }) },
        ],
      };
      setSystemNotif(newError);
      return false;
    }
    if (text.length < 2) {
      const newError = {
        show: true,
        title: "Body",
        text: "Please add some content to your new sticky note",
        color: "bg-red-200",
        hasCancel: false,
        actions: [
          { text: "close", func: () => setSystemNotif({ show: false }) },
        ],
      };
      setSystemNotif(newError);
      return false;
    }
    return true;
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Sticky"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={`p-2 text-4xl mt-10 mb-5 w-full outline-none bg-opacity-30 duration-200`}
      />
      <div className="flex flex-wrap items-center justify-center my-5">
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
      <div className="my-10 mb-40 h-80">
        <ReactQuill
          value={text}
          onChange={handleTextChange}
          className="h-full"
        />
      </div>
      <div className="rounded-md shadow-md p-3 flex justify-between items-center mb-10">
        <div className="flex justify-center items-center">
          <AiFillInfoCircle />
          <p className="ml-2">Pin</p>
        </div>
        <Toggle condition={pin} setCondition={setPin} />
      </div>
      <div className="text-xs font-semibold mb-3">
        <button
          onClick={addSticky}
          className="w-full py-2 rounded-md shadow-md bg-gradient-to-r from-lime-200 to-green-200 underline"
        >
          save
        </button>
        <button
          onClick={() => {
            setType(null);
            setAddNewEvent(false);
          }}
          className="w-full mt-3 py-2 rounded-md shadow-md bg-gradient-to-tr from-red-200 to-rose-200 underline"
        >
          cancel
        </button>
      </div>
    </div>
  );
};

export default AddSticky;
