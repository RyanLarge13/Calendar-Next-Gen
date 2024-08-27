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
  const { lists, setLists, userTasks, preferences, setUserTasks } =
    useContext(UserContext);
  const { dateObj } = useContext(DatesContext);
  const { hideMenuNav } = useContext(InteractiveContext);

  const [timeOfDay, setTimeOfDay] = useState(null);
  const [reminderSort, setReminderSort] = useState(false);
  const [reminderSearch, setReminderSearch] = useState(false);
  const [reminderSortOpt, setReminderSortOpt] = useState("");
  const [reminderSearchTxt, setReminderSearchTxt] = useState("");
  const [listSort, setListSort] = useState(false);
  const [listSearch, setListSearch] = useState(false);
  const [listSortOpt, setListSortOpt] = useState("");
  const [listSearchTxt, setListSearchTxt] = useState("");

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
                      value={reminderSort}
                      toggle={setReminderSort}
                    />
                    <Switch
                      title="Search"
                      styles=""
                      value={reminderSearch}
                      toggle={setReminderSearch}
                    />
                  </div>
                  {reminderSort ? (
                    <>
                      <div className="flex flex-wrap justify-start items-start gap-2 mt-5">
                        <button
                          onClick={() => setReminderSortOpt("title")}
                          className={`${
                            reminderSortOpt === "title"
                              ? "bg-cyan-400"
                              : "bg-cyan-200"
                          } rounded-md py-1 px-3 shadow-md`}
                        >
                          Title
                        </button>
                        <button
                          onClick={() => setReminderSortOpt("important")}
                          className={`${
                            reminderSortOpt === "important"
                              ? "bg-cyan-400"
                              : "bg-cyan-200"
                          } rounded-md py-1 px-3 shadow-md`}
                        >
                          Important
                        </button>
                        <button
                          onClick={() => setReminderSortOpt("event")}
                          className={`${
                            reminderSortOpt === "event"
                              ? "bg-cyan-400"
                              : "bg-cyan-200"
                          } rounded-md py-1 px-3 shadow-md`}
                        >
                          Event
                        </button>
                        <button
                          onClick={() => setReminderSortOpt("today")}
                          className={`${
                            reminderSortOpt === "today"
                              ? "bg-cyan-400"
                              : "bg-cyan-200"
                          } rounded-md py-1 px-3 shadow-md`}
                        >
                          Today
                        </button>
                        <button
                          onClick={() => setReminderSortOpt("tomorrow")}
                          className={`${
                            reminderSortOpt === "tomorrow"
                              ? "bg-cyan-400"
                              : "bg-cyan-200"
                          } rounded-md py-1 px-3 shadow-md`}
                        >
                          Tomorrow
                        </button>
                        <button
                          onClick={() => setReminderSortOpt("month")}
                          className={`${
                            reminderSortOpt === "month"
                              ? "bg-cyan-400"
                              : "bg-cyan-200"
                          } rounded-md py-1 px-3 shadow-md`}
                        >
                          This Month
                        </button>
                        <button
                          onClick={() => setReminderSortOpt("week")}
                          className={`${
                            reminderSortOpt === "week"
                              ? "bg-cyan-400"
                              : "bg-cyan-200"
                          } rounded-md py-1 px-3 shadow-md`}
                        >
                          This Week
                        </button>
                        <button
                          onClick={() => setReminderSortOpt("past")}
                          className={`${
                            reminderSortOpt === "past"
                              ? "bg-cyan-400"
                              : "bg-cyan-200"
                          } rounded-md py-1 px-3 shadow-md`}
                        >
                          Past Reminders
                        </button>
                      </div>
                    </>
                  ) : null}
                  {reminderSearch ? (
                    <input
                      className="outline-none focus:outline-none rounded-md shadow-md px-3 py-2 mt-3 w-full"
                      placeholder="Search Reminders"
                      onChange={(e) => setReminderSearchTxt(e.target.value)}
                    />
                  ) : null}
                  <Reminders
                    sort={reminderSort}
                    sortOpt={reminderSortOpt}
                    search={reminderSearch}
                    searchTxt={reminderSearchTxt}
                  />
                </motion.div>
              )}
              {showCategory === "todo-list" && (
                <motion.div
                  initial={{ x: "-10%", opacity: 0 }}
                  exit={{ x: "-10%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="mt-10"
                >
                  <Switch
                    title="Sort"
                    styles=""
                    value={listSort}
                    toggle={setListSort}
                  />
                  <Switch
                    title="Search"
                    styles="mt-3"
                    value={listSearch}
                    toggle={setListSearch}
                  />
                  {listSort ? (
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setListSortOpt("title")}
                        className={`${
                          listSortOpt === "title" ? "bg-cyan-300" : "bg-white"
                        } shadow-md rounded-md px-3 py-2`}
                      >
                        Title
                      </button>
                      <button
                        onClick={() => setListSortOpt("event")}
                        className={`${
                          listSortOpt === "event" ? "bg-cyan-300" : "bg-white"
                        } shadow-md rounded-md px-3 py-2`}
                      >
                        Event
                      </button>
                    </div>
                  ) : null}
                  {listSearch ? (
                    <input
                      type="text"
                      onChange={(e) => setListSearchTxt(e.target.value)}
                      placeholder="Search your lists"
                      className="outline-none rounded-md shadow-md p-3 w-full"
                    />
                  ) : null}
                  <Lists
                    listSort={listSort}
                    listSortOpt={listSortOpt}
                    listSearch={listSearch}
                    listSearchTxt={listSearchTxt}
                  />
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
