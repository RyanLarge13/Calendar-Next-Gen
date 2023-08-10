import { useState, useContext, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiArrowUpDownFill } from "react-icons/ri";
import { FaStickyNote } from "react-icons/fa";
import { AiOutlinePlus, AiFillSchedule } from "react-icons/ai";
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

  useEffect(() => {
    if (showCategory !== null && infoRef.current) {
      setTimeout(() => {
        infoRef.current.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }, [showCategory]);

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
          <h1 className="text-4xl pb-2 font-semibold">{timeOfDay}</h1>
          {user.username && (
            <p className="ml-5 font-semibold">{user.username}</p>
          )}
          <div className="grid grid-cols-2 gap-5 mt-10 place-items-center text-4xl">
            <motion.div
              animate={
                showCategory === "reminders" ? { scale: 1.1 } : { scale: 1 }
              }
              className="p-3 flex justify-center items-center w-full h-full rounded-md shadow-md relative min-h-[150px] bg-gradient-to-tr from-lime-300 to-emerald-200"
              onClick={() => setShowCategory("reminders")}
            >
              <IoIosAlarm />
              <div className="p-3 bg-purple-100 absolute bottom-0 right-0 left-0 rounded-md flex justify-center items-center">
                <p className="text-xs">Reminders</p>
              </div>
            </motion.div>
            <motion.div
              animate={showCategory === "lists" ? { scale: 1.1 } : { scale: 1 }}
              className="p-3 flex justify-center items-center w-full h-full rounded-md shadow-md relative min-h-[150px] bg-gradient-to-tr from-red-300 to-orange-300"
              onClick={() => setShowCategory("lists")}
            >
              <BsListCheck />
              <div className="p-3 bg-purple-100 absolute bottom-0 right-0 left-0 rounded-md flex justify-center items-center">
                <p className="text-xs">Lists</p>
              </div>
            </motion.div>
            <div
              className="p-3 flex justify-center items-center w-full h-full rounded-md shadow-md relative min-h-[150px] bg-gradient-to-tr from-teal-300 to-cyan-300"
              onClick={() => setShowCategory("tasks")}
            >
              <BsListTask />
              <div className="p-3 bg-purple-100 absolute bottom-0 right-0 left-0 rounded-md flex justify-center items-center">
                <p className="text-xs">Tasks</p>
              </div>
            </div>
            <div
              className="p-3 flex justify-center items-center w-full h-full rounded-md shadow-md relative min-h-[150px] bg-gradient-to-tr from-violet-300 to-purple-300"
              onClick={() => setShowCategory("kanban")}
            >
              <BsFillClipboardDataFill />
              <div className="p-3 bg-purple-100 absolute bottom-0 right-0 left-0 rounded-md flex justify-center items-center">
                <p className="text-xs">Kanban Boards</p>
              </div>
            </div>
            <div
              className="p-3 flex justify-center items-center w-full h-full rounded-md shadow-md relative min-h-[150px] bg-gradient-to-tr from-white to-slate-300"
              onClick={() => setShowCategory("events")}
            >
              <BsFillCalendar2EventFill />
              <div className="p-3 bg-purple-100 absolute bottom-0 right-0 left-0 rounded-md flex justify-center items-center">
                <p className="text-xs">Events</p>
              </div>
            </div>
            <div
              className="p-3 flex justify-center items-center w-full h-full rounded-md shadow-md relative min-h-[150px] bg-gradient-to-tr from-indigo-300 to-sky-300"
              onClick={() => setShowCategory("groupevents")}
            >
              <HiUserGroup />
              <div className="p-3 bg-purple-100 absolute bottom-0 right-0 left-0 rounded-md flex justify-center items-center">
                <p className="text-xs">Group Events</p>
              </div>
            </div>
            <div className="p-3 flex justify-center items-center w-full h-full rounded-md shadow-md relative min-h-[150px] bg-gradient-to-tr from-orange-300 to-yellow-300">
              <FaStickyNote />
              <div className="p-3 bg-purple-100 absolute bottom-0 right-0 left-0 rounded-md flex justify-center items-center">
                <p className="text-xs">Sticky Notes</p>
              </div>
            </div>
            <div className="p-3 flex justify-center items-center w-full h-full rounded-md shadow-md relative min-h-[150px] bg-gradient-to-tr from-pink-300 to-fuchsia-300">
              <AiFillSchedule />
              <div className="p-3 bg-purple-100 absolute bottom-0 right-0 left-0 rounded-md flex justify-center items-center">
                <p className="text-xs">Appointments</p>
              </div>
            </div>
          </div>
          {showCategory && (
            <div ref={infoRef} className="pt-10">
              {showCategory === "reminders" && <Reminders />}
              {showCategory === "lists" && <Lists />}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Menu;
