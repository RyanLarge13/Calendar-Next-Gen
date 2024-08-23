import { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reminders from "./Reminders.jsx";
import Lists from "./Lists.jsx";
import Tasks from "./Tasks";
import Kanbans from "./Kanbans";
//import Stickies from "./Stickies";
import MainMenu from "./MainMenu";
import { updateList, updateTasks } from "../utils/api.js";
import InteractiveContext from "../context/InteractiveContext";
import UserContext from "../context/UserContext.jsx";
import DatesContext from "../context/DatesContext.jsx";
import Switch from "./Switch.jsx";

const Menu = () => {
  const {
    menu,
    listUpdate,
    setListUpdate,
    taskUpdates,
    setTaskUpdates,
    showCategory,
  } = useContext(InteractiveContext);
  const { lists, setLists, user, userTasks, preferences, setUserTasks } =
    useContext(UserContext);
  const { dateObj } = useContext(DatesContext);
  const { hideMenuNav } = useContext(InteractiveContext);

  const [timeOfDay, setTimeOfDay] = useState(null);
  const [sort, setSort] = useState(false);
  const [search, setSearch] = useState(false);

  useEffect(() => {
    if (listUpdate.length < 1) return;
    if (listUpdate.length > 0) {
      const token = localStorage.getItem("authToken");
      updateClientLists();
      updateList(token, listUpdate)
        .then(() => {
          setListUpdate([]);
        })
        .catch((err) => {
          console.log(err);
          const lastUpdatedId = listUpdate[listUpdate.length - 1].listId;
          const listIndex = lists.findIndex(
            (list) => list.id === lastUpdatedId
          );
          if (listIndex !== -1) {
            const updatedLists = [...lists];
            const movedList = updatedLists.splice(listIndex, 1)[0];
            updatedLists.unshift(movedList);
            setLists(updatedLists);
          }
        });
    }
  }, [menu, showCategory]);

  useEffect(() => {
    if (taskUpdates.length < 1) return;
    if (taskUpdates.length > 0) {
      const token = localStorage.getItem("authToken");
      updateClientTasks();
      updateTasks(token, taskUpdates)
        .then((res) => {
          console.log(res);
          setTaskUpdates([]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [menu, showCategory]);

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

  const updateClientTasks = () => {
    const updatedTasks = userTasks.map((tsk) => {
      const foundUpdate = taskUpdates.find(
        (update) => update.taskId === tsk.id
      );
      if (foundUpdate) {
        return { ...tsk, tasks: foundUpdate.taskItems };
      }
      return tsk;
    });
    setUserTasks(updatedTasks);
  };

  return (
    <AnimatePresence>
      {menu && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, paddingTop: hideMenuNav ? 10 : 200 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-10 pb-10 px-5 rounded-md
                    will-change-transform shadow-md overflow-auto scrollbar-slick ${
                      preferences.darkMode
                        ? "bg-[#222] text-white"
                        : "bg-white text-black"
                    }`}
        >
          {showCategory === null && <MainMenu timeOfDay={timeOfDay} />}
          {showCategory && (
            <div className="">
              {showCategory === "reminder" && (
                <motion.div
                  initial={{ x: "-10%", opacity: 0 }}
                  exit={{ x: "-10%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <div className="mt-10">
                    <Switch
                      title="Sort"
                      styles="mb-3"
                      value={sort}
                      toggle={setSort}
                    />
                    <Switch
                      title="Search"
                      styles=""
                      value={search}
                      toggle={setSearch}
                    />
                  </div>
                  {sort ? (
                    <>
                      <div className="flex flex-wrap justify-start items-start gap-2 mt-5">
                        <button
                          className={`rounded-md py-1 px-3 shadow-md bg-cyan-200`}
                        >
                          TItle
                        </button>
                        <button
                          className={`rounded-md py-1 px-3 shadow-md bg-cyan-200`}
                        >
                          Important
                        </button>
                        <button
                          className={`rounded-md py-1 px-3 shadow-md bg-cyan-200`}
                        >
                          Event
                        </button>
                        <button
                          className={`rounded-md py-1 px-3 shadow-md bg-cyan-200`}
                        >
                          Today
                        </button>
                        <button
                          className={`rounded-md py-1 px-3 shadow-md bg-cyan-200`}
                        >
                          Tomorrow
                        </button>
                        <button
                          className={`rounded-md py-1 px-3 shadow-md bg-cyan-200`}
                        >
                          This Month
                        </button>
                        <button
                          className={`rounded-md py-1 px-3 shadow-md bg-cyan-200`}
                        >
                          This Week
                        </button>
                      </div>
                      <p className="mt-5">Group By</p>
                      <div className="mt-5 flex flex-wrap justify-start items-start">
                        <button
                          className={`rounded-md py-1 px-3 shadow-md bg-cyan-100`}
                        >
                          Date
                        </button>
                        <button
                          className={`rounded-md py-1 px-3 shadow-md bg-cyan-100`}
                        >
                          Event
                        </button>
                        <button
                          className={`rounded-md py-1 px-3 shadow-md bg-cyan-100`}
                        >
                          Date
                        </button>
                      </div>
                    </>
                  ) : null}
                  <Reminders />
                </motion.div>
              )}
              {showCategory === "todo-list" && (
                <motion.div
                  initial={{ x: "-10%", opacity: 0 }}
                  exit={{ x: "-10%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <Lists />
                </motion.div>
              )}
              {showCategory === "task" && (
                <motion.div
                  initial={{ x: "-10%", opacity: 0 }}
                  exit={{ x: "-10%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <Tasks />
                </motion.div>
              )}
              {showCategory === "kanban" && (
                <motion.div
                  initial={{ x: "-10%", opacity: 0 }}
                  exit={{ x: "-10%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <Kanbans />
                </motion.div>
              )}
              {showCategory === "stickynote" && (
                <motion.div
                  initial={{ x: "-10%", opacity: 0 }}
                  exit={{ x: "-10%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="relative"
                >
                  {/* <Stickies />*/}
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Menu;
