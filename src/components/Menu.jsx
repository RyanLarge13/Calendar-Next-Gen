import { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiArrowUpDownFill } from "react-icons/ri";
import { AiOutlinePlus } from "react-icons/ai";
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
  const { lists, setLists } = useContext(UserContext);
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
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "110%", opacity: 0 }}
          className="fixed inset-0 top-20 rounded-md bg-white shadow-md shadow-purple-200 overflow-y-auto"
          style={{ fontSize: 12 }}
        >
          <div className="bg-gradient-to-tr from-purple-200 to-fucsia-100 p-2 rounded-t-md shadow-md flex justify-between items-center">
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
                className="font-bold text-lg cursor-pointer mr-5"
              />
            </div>
            <p>Reminders</p>
          </div>
          <Reminders showReminders={showReminders} />
          <div
            onClick={() => setShowLists((prev) => !prev)}
            className="bg-gradient-to-tr from-purple-200 to-fucsia-100 p-2 rounded-t-md shadow-md flex justify-between items-center"
          >
            <div className="flex">
              <RiArrowUpDownFill />
              <AiOutlinePlus />
            </div>
            <p>Todo Lists</p>
          </div>
          <Lists showLists={showLists} />
          <div
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Menu;
