import { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiArrowUpDownFill } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";
import { BsListCheck } from "react-icons/bs";
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
  const [showReminders, setShowReminders] = useState(true);
  const [showLists, setShowLists] = useState(true);

  useEffect(() => {
    if (listUpdate.length < 1) return;
    if (listUpdate.length > 0) {
      const token = localStorage.getItem("authToken");
      updateClientLists();
      updateList(token, listUpdate)
        .then((res) => {
          setListUpdate([]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [menu]);

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
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          className="fixed inset-0 pt-20 pb-10 px-5 rounded-md bg-white shadow-md"
        >
          <h1 className="text-4xl pb-2 font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Goog Morning
          </h1>
          <p className="ml-5 bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent font-semibold">
            {user.username}
          </p>
          <div className="grid grid-cols-2 gap-5 mt-10 place-items-center text-white text-4xl">
            <div className="bg-gradient-to-r from-teal-200 to-teal-500 p-3 flex justify-center items-center w-full h-full rounded-md shadow-md">
              <IoIosAlarm />
            </div>
            <div className="bg-gradient-to-r from-teal-200 to-teal-500 p-3 flex justify-center items-center w-full h-full rounded-md shadow-md">
              <BsListCheck />
            </div>
            <div className="bg-gradient-to-r from-teal-200 to-teal-500 p-3 flex justify-center items-center w-full h-full rounded-md shadow-md">
              <BsListCheck />
            </div>
            <div className="bg-gradient-to-r from-teal-200 to-teal-500 p-3 flex justify-center items-center w-full h-full rounded-md shadow-md">
              <BsListCheck />
            </div>
          </div>
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
