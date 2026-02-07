import { useContext, useState } from "react";
import { AiFillInfoCircle } from "react-icons/ai";
import { BsSticky } from "react-icons/bs";
import { MdFreeCancellation } from "react-icons/md";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { colors } from "../../constants.js";
import DatesContext from "../../context/DatesContext.jsx";
import InteractiveContext from "../../context/InteractiveContext.jsx";
import UserContext from "../../context/UserContext.jsx";
import { addNewSticky } from "../../utils/api.js";
import Color from "../Misc/Color.jsx";
import Toggle from "../Misc/Toggle";

const AddSticky = () => {
  const { setStickies, setSystemNotif, preferences } = useContext(UserContext);
  const { setType, setAddNewEvent } = useContext(InteractiveContext);
  const { setOpenModal } = useContext(DatesContext);

  const [title, setTitle] = useState("");
  const [color, setColor] = useState("");
  const [text, setText] = useState("");
  const [pin, setPin] = useState(false);

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      [{ color: [] }, { background: [] }], // Color and Background buttons
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "color",
    "background",
    "clean",
  ];

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
          setStickies((prev) => [res.data.sticky, ...prev]);
          setOpenModal(false);
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
    <div className="h-screen flex flex-col justify-between p-5 pt-16">
      <div className="relative">
        {/* Title */}
        <input
          type="text"
          placeholder="Sticky"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`
      w-full mt-2 mb-4 h-20 bg-transparent
      text-3xl sm:text-4xl font-semibold tracking-tight
      outline-none placeholder:opacity-60
      ${preferences.darkMode ? "text-white placeholder:text-gray-300" : "text-slate-900 placeholder:text-slate-500"}
    `}
        />

        {/* Color picker */}
        <div className="flex flex-wrap items-center justify-center gap-1 py-2 mb-4">
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

        {/* Editor */}
        <div
          className={`
      mb-6 rounded-2xl border shadow-sm overflow-hidden
      ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-white border-black/10"}
    `}
        >
          <div
            className={`
        px-4 py-3 border-b
        ${preferences.darkMode ? "border-white/10" : "border-black/10"}
      `}
          >
            <p
              className={`text-sm font-semibold ${preferences.darkMode ? "text-white/80" : "text-slate-800"}`}
            >
              Note
            </p>
            <p
              className={`text-xs mt-1 ${preferences.darkMode ? "text-white/55" : "text-slate-500"}`}
            >
              Write anything—this will be saved as your sticky.
            </p>
          </div>

          <div className={`h-80 sm:h-[22rem] p-3 ${color} shadow-lg`}>
            <ReactQuill
              value={text}
              onChange={handleTextChange}
              modules={modules}
              formats={formats}
              className={`
          h-full scrollbar-slick normal
          
        `}
            />
          </div>
        </div>

        {/* Pin */}
        <div
          className={`
      rounded-2xl border p-4 shadow-sm transition-all
      ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/7" : "bg-white border-black/10 hover:bg-black/[0.02]"}
    `}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div
                className={`
            grid place-items-center h-9 w-9 rounded-xl border
            ${preferences.darkMode ? "bg-white/5 border-white/10 text-cyan-200" : "bg-cyan-50 border-cyan-100 text-cyan-600"}
          `}
              >
                <AiFillInfoCircle />
              </div>

              <div>
                <p
                  className={`text-sm font-semibold ${preferences.darkMode ? "text-white" : "text-slate-800"}`}
                >
                  Pin
                </p>
                <p
                  className={`text-xs ${preferences.darkMode ? "text-white/60" : "text-slate-500"}`}
                >
                  Keep this sticky stationary
                </p>
              </div>
            </div>

            <Toggle condition={pin} setCondition={setPin} />
          </div>
        </div>
      </div>
      {/* Bottom actions */}

      <div className="flex justify-between items-center w-full mt-5 max-w-xl">
        <button
          onClick={() => {
            setType(null);
            setAddNewEvent(false);
          }}
          className="
          grid place-items-center rounded-2xl p-3 shadow-lg transition
          hover:scale-[0.98] active:scale-95
          bg-gradient-to-tr from-red-500 to-rose-500 text-white
        "
          aria-label="Cancel"
        >
          <MdFreeCancellation className="text-xl" />
        </button>

        <button
          onClick={addSticky}
          className="
          grid place-items-center rounded-2xl p-3 shadow-lg transition
          hover:scale-[0.98] active:scale-95
          bg-gradient-to-tr from-lime-400 to-emerald-500 text-white
        "
          aria-label="Save tasks"
        >
          <BsSticky className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default AddSticky;
