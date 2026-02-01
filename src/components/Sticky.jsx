import { useState, useRef, useContext, useEffect } from "react";
import { motion, useDragControls } from "framer-motion";
import {
  deleteStickyNote,
  updateSticky,
  updateStickyView,
} from "../utils/api.js";
import { tailwindBgToHex } from "../utils/helpers.js";
import {
  AiFillPushpin,
  AiFillCloseCircle,
  AiOutlinePushpin,
} from "react-icons/ai";
import { BiExpand, BiCollapse } from "react-icons/bi";
import { FaRegWindowMinimize } from "react-icons/fa";
import { FiMaximize } from "react-icons/fi";
import UserContext from "../context/UserContext";
import InteractiveContext from "../context/InteractiveContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Sticky = ({ sticky, index }) => {
  const { setSystemNotif, setStickies, stickies, preferences } =
    useContext(UserContext);
  const { event } = useContext(InteractiveContext);

  const [expand, setExpand] = useState(false);
  const [pin, setPin] = useState(sticky.pin);
  const [fullScreen, setFullScreen] = useState(false);
  const [minimize, setMinimize] = useState(true);
  const [editText, setEditText] = useState(sticky.body);
  const [initialText, setInitialText] = useState(sticky.body);

  const stickyRef = useRef(null);

  const controls = useDragControls();

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

  useEffect(() => {
    const viewState = sticky.viewState;
    switch (viewState) {
      case "minimized":
        break;
      case "fullscreen":
        setFullScreen(true);
        break;
      case "expand":
        setFullScreen(false);
        setMinimize(false);
        setExpand(true);
        break;
      default:
        null;
    }
  }, []);

  useEffect(() => {
    let timeout;
    timeout = setTimeout(() => {
      handleSave();
    }, 2000);

    return () => clearTimeout(timeout);
  }, [editText]);

  const handleViewChange = (newView) => {
    const token = localStorage.getItem("authToken");
    updateStickyView(token, sticky.id, newView)
      .then((res) => {
        console.log(`Success Updating sticky view: ${res}`);
      })
      .catch((err) => {
        console.log(`Error updating sticky view: ${err}`);
      });
  };

  const handleTextChange = (value) => {
    setEditText(value);
  };

  const handleSave = async () => {
    if (initialText === editText) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      await updateSticky(token, sticky.id, editText);

      setInitialText(editText);
    } catch (err) {
      console.log(`Error from server saving sticky note. Error: ${err}`);
    }
  };

  const startDrag = (e) => {
    controls.start(e);
  };

  const confirmDelete = (stickyId) => {
    const newConfirmation = {
      show: true,
      title: "Delete sticky",
      text: "Are you sure you want to delete this sticky note?",
      color: "bg-red-200",
      hasCancel: true,
      actions: [
        { text: "close", func: () => setSystemNotif({ show: false }) },
        { text: "delete", func: () => deleteSticky(stickyId) },
      ],
    };
    setSystemNotif(newConfirmation);
  };

  const deleteSticky = (stickyId) => {
    setSystemNotif({ show: false });
    const token = localStorage.getItem("authToken");
    if (!token) {
    }
    if (token) {
      deleteStickyNote(token, stickyId)
        .then((res) => {
          const newStickies = stickies.filter((item) => item.id !== stickyId);
          setStickies(newStickies);
          const newSuccess = {
            show: true,
            title: "Deleted Sticky",
            text: "Successfully deleted your sticky note",
            color: "bg-green-200",
            hasCancel: false,
            actions: [
              {
                text: "close",
                func: () => setSystemNotif({ show: false }),
              },
              { text: "undo", func: () => {} },
            ],
          };
          setSystemNotif(newSuccess);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      exit={{ scale: 0 }}
      animate={{
        x: fullScreen || minimize ? 0 : null,
        y: fullScreen ? 0 : minimize ? 0 + index * 50 : null,
        opacity: event ? 0 : 1,
        height: fullScreen
          ? window.innerHeight
          : expand
            ? 500
            : minimize
              ? 150
              : 175,
        width: fullScreen
          ? window.innerWidth
          : expand
            ? 280
            : minimize
              ? 8
              : 200,
      }}
      drag={fullScreen ? false : minimize ? "y" : !pin}
      dragControls={controls}
      dragListener={false}
      dragConstraints={{
        top: 0,
        right: window.innerWidth - 200,
        left: 0,
        bottom: window.innerHeight - 200,
      }}
      ref={stickyRef}
      className={`
    markdown fixed z-[999] overflow-hidden
    rounded-2xl border shadow-2xl
    transition-all duration-300 ease-in-out
    ${minimize ? "text-transparent rounded-l-none" : ""}
    ${preferences.darkMode ? "border-white/10" : "border-black/10"}
    ${preferences.darkMode ? "bg-[#161616]/90" : "bg-white/90"}
    backdrop-blur-md
  `}
      onClick={() => {
        if (minimize) {
          if ("vibrate" in navigator) navigator.vibrate(75);
          setMinimize(false);
          setExpand(true);
          handleViewChange("expand");
        }
      }}
    >
      {/* Accent bar (uses your sticky color, but only as an accent) */}
      <div
        className={`${sticky.color} absolute left-0 top-0 bottom-0 w-2 z-20`}
      />

      {/* Header */}
      <div
        className={`
      ${minimize ? "opacity-0 pointer-events-none" : ""}
      relative px-3 py-2 flex justify-between items-center
      border-b
      ${preferences.darkMode ? "border-white/10" : "border-black/10"}
      ${preferences.darkMode ? "bg-white/5" : "bg-white/70"}
      backdrop-blur-md
    `}
        onPointerDown={startDrag}
        style={{ touchAction: "none" }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPin((prev) => !prev)}
            className={`
          grid place-items-center h-9 w-9 rounded-2xl border shadow-sm transition active:scale-95
          ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70" : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"}
        `}
            aria-label="Pin"
          >
            {pin ? <AiFillPushpin /> : <AiOutlinePushpin />}
          </button>

          <button
            onClick={() => {
              if (fullScreen && !expand) return;
              if (fullScreen && expand) {
                setFullScreen(false);
                setExpand(false);
                handleViewChange("minimized");
              }
              if (!expand && !fullScreen) {
                handleViewChange("expand");
                setExpand(true);
              }
              if (expand && !fullScreen) {
                handleViewChange("minimized");
                setExpand(false);
              }
            }}
            className={`
          grid place-items-center h-9 w-9 rounded-2xl border shadow-sm transition active:scale-95
          ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70" : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"}
        `}
            aria-label={expand ? "Collapse" : "Expand"}
          >
            {expand ? <BiCollapse /> : <BiExpand />}
          </button>
        </div>

        <button
          type="button"
          onClick={() => confirmDelete(sticky.id)}
          className={`
        grid place-items-center h-9 w-9 rounded-2xl border shadow-sm transition active:scale-95
        ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/60 hover:text-rose-300" : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-500 hover:text-rose-500"}
      `}
          aria-label="Delete sticky"
        >
          <AiFillCloseCircle className="text-lg" />
        </button>
      </div>

      {/* Footer (only in expand mode) */}
      {expand && (
        <div
          className={`
        ${minimize ? "opacity-0 pointer-events-none" : ""}
        absolute bottom-0 left-0 right-0
        px-3 py-2 flex justify-between items-center
        border-t
        ${preferences.darkMode ? "border-white/10" : "border-black/10"}
        ${preferences.darkMode ? "bg-white/5" : "bg-white/70"}
        backdrop-blur-md z-10
      `}
        >
          <button
            onClick={() => {
              setFullScreen((prev) => !prev);
              handleViewChange("fullscreen");
            }}
            className={`
          grid place-items-center h-9 w-9 rounded-2xl border shadow-sm transition active:scale-95
          ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70" : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"}
        `}
            aria-label="Fullscreen"
          >
            <FiMaximize />
          </button>

          <button
            onClick={() => {
              setMinimize(true);
              setExpand(false);
              setFullScreen(false);
              handleViewChange("minimized");
            }}
            className={`
          grid place-items-center h-9 w-9 rounded-2xl border shadow-sm transition active:scale-95
          ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70 hover:text-rose-300" : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600 hover:text-rose-500"}
        `}
            aria-label="Minimize"
          >
            <FaRegWindowMinimize />
          </button>
        </div>
      )}

      {/* Body */}
      <div
        className={`
      ${minimize ? "opacity-0 pointer-events-none" : "opacity-100"}
      absolute inset-0
      px-4 pt-4 pb-16
      overflow-y-auto overflow-x-hidden scrollbar-hide
      ${expand ? "mt-12" : "mt-12"} 
    `}
      >
        <div className="space-y-3">
          {/* Title */}
          <input
            defaultValue={sticky.title}
            className={`
          w-full bg-transparent
          text-2xl font-semibold tracking-tight
          outline-none
          border-b pb-2
          ${preferences.darkMode ? "border-white/10 text-white placeholder:text-white/50" : "border-black/10 text-slate-900 placeholder:text-slate-400"}
        `}
            style={{ caretColor: tailwindBgToHex(sticky.color) }}
            placeholder="Title…"
          />

          {/* Editor container */}
          <div
            className={`
          rounded-2xl border shadow-sm overflow-hidden
          ${preferences.darkMode ? "border-white/10 bg-white/5" : "border-black/10 bg-white"}
        `}
          >
            <ReactQuill
              modules={modules}
              formats={formats}
              value={editText}
              onBlur={handleSave}
              onChange={handleTextChange}
              className="h-full scrollbar-slick"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sticky;
