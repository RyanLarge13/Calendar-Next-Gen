import { useState, useContext, useEffect } from "react";
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
          <h1 className="text-4xl pb-2 font-semibold">{timeOfDay}</h1>
          {user.username && (
            <p className="ml-5 font-semibold">{user.username}</p>
          )}
          <div className="grid grid-cols-2 gap-5 mt-10 place-items-center text-4xl">
            <motion.div
              animate={
                showCategory === "reminders" ? { scale: 1.025 } : { scale: 1 }
              }
              className="p-3 flex justify-center items-center w-full h-full rounded-md shadow-md relative h-40"
              onClick={() => setShowCategory("reminders")}
            >
              <IoIosAlarm />
              <div className="p-3 bg-purple-100 absolute bottom-0 right-0 left-0 rounded-md flex justify-center items-center">
                <p className="text-xs">Reminders</p>
              </div>
            </motion.div>
            <div className="p-3 flex justify-center items-center w-full h-full rounded-md shadow-md relative h-40" onClick={() => setShowCategory("lists")} >
              <BsListCheck />
              <div
                className="p-3 bg-purple-100 absolute bottom-0 right-0 left-0 rounded-md flex justify-center items-center"
              >
                <p className="text-xs">Lists</p>
              </div>
            </div>
            <div className="p-3 flex justify-center items-center w-full h-full rounded-md shadow-md relative h-40">
              <BsListTask />
              <div className="p-3 bg-purple-100 absolute bottom-0 right-0 left-0 rounded-md flex justify-center items-center">
                <p className="text-xs">Tasks</p>
              </div>
            </div>
            <div className="p-3 flex justify-center items-center w-full h-full rounded-md shadow-md relative h-40">
              <BsFillClipboardDataFill />
              <div className="p-3 bg-purple-100 absolute bottom-0 right-0 left-0 rounded-md flex justify-center items-center">
                <p className="text-xs">Kanban Boards</p>
              </div>
            </div>
            <div className="p-3 flex justify-center items-center w-full h-full rounded-md shadow-md relative h-40">
              <BsFillCalendar2EventFill />
              <div className="p-3 bg-purple-100 absolute bottom-0 right-0 left-0 rounded-md flex justify-center items-center">
                <p className="text-xs">Events</p>
              </div>
            </div>
            <div className="p-3 flex justify-center items-center w-full h-full rounded-md shadow-md relative h-40">
              <HiUserGroup />
              <div className="p-3 bg-purple-100 absolute bottom-0 right-0 left-0 rounded-md flex justify-center items-center">
                <p className="text-xs">Group Events</p>
              </div>
            </div>
            <div className="p-3 flex justify-center items-center w-full h-full rounded-md shadow-md relative h-40">
              <FaStickyNote />
              <div className="p-3 bg-purple-100 absolute bottom-0 right-0 left-0 rounded-md flex justify-center items-center">
                <p className="text-xs">Sticky Notes</p>
              </div>
            </div>
            <div className="p-3 flex justify-center items-center w-full h-full rounded-md shadow-md relative h-40">
              <AiFillSchedule />
              <div className="p-3 bg-purple-100 absolute bottom-0 right-0 left-0 rounded-md flex justify-center items-center">
                <p className="text-xs">Appointments</p>
              </div>
            </div>
          </div>
          {showCategory && (
            <div className="mt-10">
              {showCategory === "reminders" && <Reminders />}
              {showCategory === "lists" && <Lists />}
            </div>
          )}
          {/* <div className="sticky top-0 right-0 left-0 z-10 bg-gradient-to-tr from-purple-200 to-fucsia-100 p-2 rounded-t-md shadow-md flex justify-between items-center">
            <IoIosAlarm className="text-lg" />
            <div className="flex">
              <RiArrowUpDownFill
                onClick={() => setShowReminders((prev) => !prev)}
                className="font-bold text-lg cursor-pointer mr-3"
              />
              <AiOutlinePlus
                onClick={() => {
                  if (!string) {
                    setString(new Date().toLocaleDateString());
                  }
                  setOpenModal(true);
                  setAddNewEvent(true);
                  setType("reminder");
                }}
                className="font-bold text-lg cursor-pointer"
              />
            </div>
          </div> */}
          {/* <Reminders showReminders={showReminders} /> */}
          {/* <div className="sticky top-10 right-0 left-0 z-10 bg-gradient-to-tr from-purple-200 to-fucsia-100 p-2 rounded-t-md shadow-md flex justify-between items-center">
            <BsListCheck className="text-lg" />
            <div className="flex">
              <RiArrowUpDownFill
                className="font-bold text-lg cursor-pointer mr-3"
                onClick={() => setShowLists((prev) => !prev)}
              />
              <AiOutlinePlus
                className="font-bold text-lg cursor-pointer"
                onClick={() => {
                  if (!string) {
                    setString(new Date().toLocaleDateString());
                  }
                  setOpenModal(true);
                  setAddNewEvent(true);
                  setType("todo-list");
                }}
              />
            </div>
          </div> */}
          {/* <Lists showLists={showLists} /> */}
          {/* <div
            onClick={() => {}}
            className="bg-gradient-to-tr from-purple-200 to-fucsia-100 p-2 rounded-t-md shadow-md flex justify-between items-center"
          >
            <RiArrowUpDownFill />
            <p>Boards</p>
          </div>
          <div
            onClick={() => {}}
            className="bg-gradient-to-tr from-purple-200 to-fucsia-100 p-2 rounded-t-md shadow-md flex justify-between items-center"
          >
            <RiArrowUpDownFill />
            <p>Tasks</p>
          </div> */}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Menu;
