import { useState, useRef, useContext, useLayoutEffect } from "react";
import { motion, useDragControls } from "framer-motion";
import { deleteStickyNote, updateSticky } from "../utils/api.js";
import {
  AiFillPushpin,
  AiFillCloseCircle,
  AiOutlinePushpin,
} from "react-icons/ai";
import { BiExpand, BiCollapse } from "react-icons/bi";
import { BsFillPenFill } from "react-icons/bs";
import { FaRegWindowMinimize } from "react-icons/fa";
import { FiMaximize } from "react-icons/fi";
import { MdSave } from "react-icons/md";
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
  const [edit, setEdit] = useState(false);
  const [editText, setEditText] = useState(sticky.body);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);

  const stickyRef = useRef(null);

  const controls = useDragControls();

  const handleTextChange = (value) => {
    setEditText(value);
  };

  const handleSave = () => {
    sticky.body = editText;
    setEdit(false);
    try {
      const token = localStorage.getItem("authToken");
      updateSticky(token, sticky.id, editText)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
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
          ? 250
          : minimize
          ? 10
          : 175,
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
      className={`markdown z-[999] shadow-xl rounded-md fixed
            w-[10px] h-[150px] ${sticky.color} ${
        minimize ? "text-transparent" : "text-black"
      }`}
      onClick={() => {
        if (minimize) {
          if ("vibrate" in navigator) {
            navigator.vibrate(75);
          }
          setMinimize(false);
          setExpand(true);
        }
      }}
    >
      <div
        className={`${
          minimize ? "bg-transparent shadow-none" : "bg-slate-100 shadow-lg"
        } rounded-t-md p-2 flex justify-between items-center cursor-pointer`}
        onPointerDown={startDrag}
        style={{ touchAction: "none" }}
      >
        <div className="flex justify-between items-center gap-x-3">
          <button onClick={() => setPin((prev) => !prev)}>
            {pin ? <AiFillPushpin /> : <AiOutlinePushpin />}
          </button>
          <button
            onClick={() => (!edit ? setEdit(true) : handleSave())}
            className="flex justify-between text-sm items-center gap-x-3"
          >
            {edit ? <MdSave /> : <BsFillPenFill />}
          </button>
          <button
            onClick={() => {
              if (fullScreen && !expand) {
                return;
              }
              if (fullScreen && expand) {
                setFullScreen(false);
                setExpand(false);
              }
              if (!expand && !fullScreen) {
                setExpand(true);
              }
              if (expand && !fullScreen) {
                setExpand(false);
              }
            }}
          >
            {expand ? <BiCollapse /> : <BiExpand />}
          </button>
        </div>
        <button type="text" onClick={() => confirmDelete(sticky.id)}>
          <AiFillCloseCircle />
        </button>
      </div>
      {expand && (
        <div
          className={`${
            minimize ? "bg-transparent shadow-none" : "bg-slate-100 shadow-md"
          } rounded-b-md p-2 flex justify-between items-center`}
        >
          <button onClick={() => setFullScreen((prev) => !prev)}>
            <FiMaximize />
          </button>
          <button
            onClick={() => {
              setMinimize(true);
              setExpand(false);
              setFullScreen(false);
            }}
          >
            <FaRegWindowMinimize />
          </button>
        </div>
      )}
      <div
        className={`${
          expand ? "mt-20" : "mt-5"
        } p-2 overflow-y-auto scrollbar-slick overflow-x-hidden scrollbar-hide absolute inset-0 z-[-1] break-words`}
      >
        {!edit ? (
          <>
            <h2 className="mb-5 border-b border-b-black">{sticky.title}</h2>
            <div
              dangerouslySetInnerHTML={{ __html: sticky.body }}
              className="markdown scrollbar-slick"
            ></div>
          </>
        ) : (
          <ReactQuill
            value={editText}
            onChange={handleTextChange}
            className="h-full scrollbar-slick"
          />
        )}
      </div>
    </motion.div>
  );
};

export default Sticky;
