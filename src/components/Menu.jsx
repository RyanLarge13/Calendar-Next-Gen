import { useState, useContext, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiArrowUpDownFill } from "react-icons/ri";
import { FaStickyNote } from "react-icons/fa";
import { AiOutlinePlus, AiTwotoneHome, AiFillSchedule } from "react-icons/ai";
import { HiUserGroup } from "react-icons/hi";
import {
  BsListCheck,
  BsFillClipboardDataFill,
  BsListTask,
  BsFillCalendar2EventFill,
} from "react-icons/bs";
import { IoIosAlarm } from "react-icons/io";
import Reminders from "./Reminders.jsx";
import Lists from "./Lists.jsx";
import InteractiveContext from "../context/InteractiveContext";
import DatesContext from "../context/DatesContext.jsx";
import { updateList } from "../utils/api.js";
import UserContext from "../context/UserContext.jsx";

const Menu = () => {
  const { setOpenModal, string, setString } = useContext(DatesContext);
  const { menu, setAddNewEvent, setType, listUpdate, setListUpdate } =
    useContext(InteractiveContext);
  const { lists, setLists, user } = useContext(UserContext);
  const [showCategory, setShowCategory] = useState(null);
  const [timeOfDay, setTimeOfDay] = useState(null);

  const infoRef = useRef(null);

  useEffect(() => {
    if (listUpdate.length < 1) return;
    if (listUpdate.length > 0) {
      const token = localStorage.getItem("authToken");
      updateClientLists();
      updateList(token, listUpdate)
        .then((res) => {
          console.log(res);
          setListUpdate([]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [menu]);

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setTimeOfDay("Good Morning");
    }
    if (hours >= 12 && hours <= 16) {
      setTimeOfDay("Good Afternoon");
    }
    if (hours > 16 && hours <= 19) {
      setTimeOfDay("Good Evening");
    }
    if (hours > 19) {
      setTimeOfDay("Goodnight");
    }
  }, []);

  const updateClientLists = () => {
    const updatedLists = lists.map((list) => {
      const foundUpdate = listUpdate.find(
        (update) => update.listId === list.id
      );
      if (foundUpdate) {
        return { ...list, items: foundUpdate.listItems };
      }
      return list;
    });
    setLists(updatedLists);
  };

  return (
    <AnimatePresence>
      {menu && (
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{
            x: 0,
            opacity: 1,
          }}
          exit={{ x: "-100%", opacity: 0 }}
          className="fixed inset-0 pt-20 pb-10 px-5 rounded-md bg-white shadow-md overflow-auto"
        >
          <div className="sticky top-0 right-0 left-0 bg-white z-20 grid grid-cols-4 place-items-center mb-10 shadow-md rounded-md">
            <div
              className={`p-5 w-full flex flex-col items-center justify-center rounded-md ${
                showCategory === "reminders" ? "bg-cyan-100" : "bg-white"
              }`}
              onClick={() =>
                setShowCategory((prev) =>
                  prev === "reminders" ? null : "reminders"
                )
              }
            >
              <IoIosAlarm />
              <p className="text-xs">reminders</p>
            </div>
            <div
              className={`p-5 w-full flex flex-col items-center justify-center rounded-md ${
                showCategory === "lists" ? "bg-cyan-100" : "bg-white"
              }`}
              onClick={() =>
                setShowCategory((prev) => (prev === "lists" ? null : "lists"))
              }
            >
              <BsListCheck />
              <p className="text-xs">lists</p>
            </div>
            <div
              className={`p-5 w-full flex flex-col items-center justify-center rounded-md ${
                showCategory === "tasks" ? "bg-cyan-100" : "bg-white"
              }`}
              onClick={() =>
                setShowCategory((prev) => (prev !== "tasks" ? "tasks" : null))
              }
            >
              <BsListTask />
              <p className="text-xs">tasks</p>
            </div>
            <div
              className={`p-5 w-full flex flex-col items-center justify-center rounded-md ${
                showCategory === "kanban" ? "bg-cyan-100" : "bg-white"
              }`}
              onClick={() =>
                setShowCategory((prev) => (prev !== "kanban" ? "kanban" : null))
              }
            >
              <BsFillClipboardDataFill />
              <p className="text-xs">kanban</p>
            </div>
            <div
              className={`p-5 w-full flex flex-col items-center justify-center rounded-md ${
                showCategory === "events" ? "bg-cyan-100" : "bg-white"
              }`}
              onClick={() =>
                setShowCategory((prev) => (prev !== "events" ? "events" : null))
              }
            >
              <BsFillCalendar2EventFill />
              <p className="text-xs">events</p>
            </div>
            <div
              className={`p-5 w-full flex flex-col items-center justify-center rounded-md ${
                showCategory === "groupevents" ? "bg-cyan-100" : "bg-white"
              }`}
              onClick={() =>
                setShowCategory((prev) =>
                  prev !== "groupevents" ? "groupevents" : null
                )
              }
            >
              <HiUserGroup />
              <p className="text-xs">group</p>
            </div>
            <div
              className={`p-5 w-full flex flex-col items-center justify-center rounded-md ${
                showCategory === "stickynotes" ? "bg-cyan-100" : "bg-white"
              }`}
              onClick={() =>
                setShowCategory((prev) =>
                  prev !== "stickynotes" ? "stickynotes" : null
                )
              }
            >
              <FaStickyNote />
              <p className="text-xs">sticky</p>
            </div>
            <div
              className={`p-5 w-full flex flex-col items-center justify-center rounded-md ${
                showCategory === "appointment" ? "bg-cyan-100" : "bg-white"
              }`}
              onClick={() =>
                setShowCategory((prev) =>
                  prev !== "appointment" ? "appointment" : null
                )
              }
            >
              <AiFillSchedule />
              <p className="text-xs">appointments</p>
            </div>
            <div
              className="bottom-[-15px] absolute right-5 left-5 p-1 rounded-md shadow-md bg-cyan-100 flex justify-center items-center"
              onClick={() => setShowCategory(null)}
            >
              <AiTwotoneHome />
            </div>
          </div>
          {showCategory === null && (
            <div>
              <h1 className="text-4xl pb-2 font-semibold">{timeOfDay}</h1>
              {user.username && (
                <p className="ml-5 font-semibold">{user.username}</p>
              )}
            </div>
          )}
          {showCategory && (
            <div className="pt-20">
              {showCategory === "reminders" && (
                <AnimatePresence>
                  <motion.div
                    initial={{ x: "-100%", opacity: 0 }}
                    exit={{ x: "-100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                  >
                    <Reminders />
                  </motion.div>
                </AnimatePresence>
              )}
              {showCategory === "lists" && (
                <AnimatePresence>
                  <motion.div
                    initial={{ x: "-100%", opacity: 0 }}
                    exit={{ x: "-100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                  >
                    <Lists />
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Menu;
