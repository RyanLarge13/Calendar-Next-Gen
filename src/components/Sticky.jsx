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
  const { setSystemNotif, setStickies, stickies } = useContext(UserContext);
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
      className={`markdown z-[999] shadow-lg rounded-2xl fixed
    w-[10px] h-[150px] transition-all duration-300 ease-in-out
    ${sticky.color} ${
        minimize ? "text-transparent rounded-l-none" : "text-gray-900"
      } overflow-hidden`}
      onClick={() => {
        if (minimize) {
          if ("vibrate" in navigator) {
            navigator.vibrate(75);
          }
          setMinimize(false);
          setExpand(true);
          handleViewChange("expand");
        }
      }}
    >
      {/* Header */}
      <div
        className={`${
          minimize
            ? "opacity-0 shadow-none"
            : "bg-white/90 backdrop-blur-sm shadow-md"
        } rounded-t-2xl px-3 py-2 flex justify-between items-center`}
        onPointerDown={startDrag}
        style={{ touchAction: "none" }}
      >
        <div className="flex items-center gap-x-3 text-gray-500">
          <button
            onClick={() => setPin((prev) => !prev)}
            className="hover:text-cyan-600 transition"
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
            className="hover:text-blue-600 transition"
          >
            {expand ? <BiCollapse /> : <BiExpand />}
          </button>
        </div>
        <button
          type="text"
          onClick={() => confirmDelete(sticky.id)}
          className="text-gray-400 hover:text-red-500 transition"
        >
          <AiFillCloseCircle />
        </button>
      </div>

      {/* Footer (only in expand mode) */}
      {expand && (
        <div
          className={`${
            minimize
              ? "bg-transparent shadow-none"
              : "bg-white/90 backdrop-blur-sm"
          } rounded-b-2xl px-3 py-2 flex justify-between items-center`}
        >
          <button
            onClick={() => {
              setFullScreen((prev) => !prev);
              handleViewChange("fullscreen");
            }}
            className="text-gray-500 hover:text-indigo-600 transition"
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
            className="text-gray-500 hover:text-rose-500 transition"
          >
            <FaRegWindowMinimize />
          </button>
        </div>
      )}

      {/* Body */}
      <div
        className={`${expand ? "mt-20" : "mt-5"} ${
          minimize ? "opacity-0" : "opacity-100"
        } px-4 pb-4 overflow-y-auto scrollbar-slick overflow-x-hidden scrollbar-hide absolute inset-0 z-[-1] break-words`}
      >
        <div className="space-y-3">
          <input
            style={{ color: tailwindBgToHex(sticky.color) }}
            className="mb-4 pb-1 text-3xl font-semibold border-b border-gray-300 bg-transparent placeholder:text-white outline-none focus:outline-none"
            placeholder={sticky.title}
          />
          <ReactQuill
            modules={modules}
            formats={formats}
            style={{ color: tailwindBgToHex(sticky.color) }}
            value={editText}
            onChange={handleTextChange}
            onBlur={handleSave}
            className="h-full scrollbar-slick"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Sticky;
