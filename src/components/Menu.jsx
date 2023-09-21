import { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reminders from "./Reminders.jsx";
import Lists from "./Lists.jsx";
import Tasks from "./Tasks";
import { updateList } from "../utils/api.js";
import InteractiveContext from "../context/InteractiveContext";
import UserContext from "../context/UserContext.jsx";
import DatesContext from "../context/DatesContext.jsx";

const Menu = () => {
  const { menu, listUpdate, setListUpdate, showCategory } =
    useContext(InteractiveContext);
  const { lists, setLists, user } = useContext(UserContext);
  const { dateObj } = useContext(DatesContext);

  const [timeOfDay, setTimeOfDay] = useState(null);

  useEffect(() => {
    if (listUpdate.length < 1) return;
    if (listUpdate.length > 0) {
      const token = localStorage.getItem("authToken");
      updateClientLists();
      updateList(token, [...listUpdate])
        .then((res) => {
          const lastUpdatedId = listUpdate[listUpdate.length - 1].listId;
          const listIndex = lists.findIndex(
            (list) => list.id === lastUpdatedId
          );
          if (listIndex !== -1) {
            // Remove the list from its current position
            const updatedLists = [...lists];
            const movedList = updatedLists.splice(listIndex, 1)[0];

            // Add the list back to the front of the array
            updatedLists.unshift(movedList);

            // Update the state with the new order
            setLists(updatedLists);
          }
          setListUpdate([]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [menu]);

  useEffect(() => {
    const hours = dateObj.getHours();
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pt-40 z-10 pb-10 px-5 rounded-md bg-white shadow-md overflow-auto"
        >
          {showCategory === null && (
            <AnimatePresence>
              <motion.div
                initial={{ x: "-10%", opacity: 0 }}
                exit={{ x: "-10%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="pt-10"
              >
                <h1 className="text-4xl pb-2 font-semibold">{timeOfDay}</h1>
                {user.username && (
                  <p className="ml-5 font-semibold">{user.username}</p>
                )}
              </motion.div>
            </AnimatePresence>
          )}
          {showCategory && (
            <div className="">
              {showCategory === "reminder" && (
                <AnimatePresence>
                  <motion.div
                    initial={{ x: "-10%", opacity: 0 }}
                    exit={{ x: "-10%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                  >
                    <Reminders />
                  </motion.div>
                </AnimatePresence>
              )}
              {showCategory === "todo-list" && (
                <AnimatePresence>
                  <motion.div
                    initial={{ x: "-10%", opacity: 0 }}
                    exit={{ x: "-10%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                  >
                    <Lists />
                  </motion.div>
                </AnimatePresence>
              )}
              {showCategory === "task" && (
                <AnimatePresence>
                  <motion.div
                    initial={{ x: "-10%", opacity: 0 }}
                    exit={{ x: "-10%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                  >
                    <Tasks />
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
