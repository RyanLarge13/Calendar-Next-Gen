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
          <div className="sticky top-0 right-0 left-0 bg-white z-20 grid grid-cols-4 place-items-center gap-5 mb-10 shadow-md rounded-md px-3 py-5">
            <IoIosAlarm
              onClick={() =>
                setShowCategory((prev) =>
                  prev === "reminders" ? null : "reminders"
                )
              }
            />
            <BsListCheck
              onClick={() =>
                setShowCategory((prev) => (prev === "lists" ? null : "lists"))
              }
            />
            <BsListTask />
            <BsFillClipboardDataFill />
            <BsFillCalendar2EventFill />
            <HiUserGroup />
            <FaStickyNote />
            <AiFillSchedule />
            <div
              className="bottom-[-15px] absolute right-5 left-5 p-1 rounded-md shadow-md bg-cyan-100 text-xs flex justify-center items-center"
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
