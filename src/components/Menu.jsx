import { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reminders from "./Reminders.jsx";
import Lists from "./Lists.jsx";
import Tasks from "./Tasks";
import Kanbans from "./Kanbans";
import MainMenu from "./MainMenu";
import { updateList, updateTasks } from "../utils/api.js";
import InteractiveContext from "../context/InteractiveContext";
import UserContext from "../context/UserContext.jsx";
import DatesContext from "../context/DatesContext.jsx";
import Switch from "./Switch.jsx";
import StaticStickies from "./StaticStickies.jsx";
import { formatDbText, formatTime } from "../utils/helpers.js";
import { MdOutlineOpenInNew } from "react-icons/md";

const Menu = () => {
  const {
    menu,
    listUpdate,
    setListUpdate,
    taskUpdates,
    setTaskUpdates,
    showCategory,
  } = useContext(InteractiveContext);
  const { lists, setLists, userTasks, preferences, setUserTasks, events } =
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
  const [taskSort, setTaskSort] = useState(false);
  const [taskSearch, setTaskSearch] = useState(false);
  const [taskSortOpt, setTaskSortOpt] = useState("");
  const [taskSearchTxt, setTaskSearchTxt] = useState("");

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
                  className="pt-3"
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
                              ? "bg-cyan-200"
                              : "bg-white"
                          } rounded-md py-1 px-3 shadow-md`}
                        >
                          Title
                        </button>
                        <button
                          onClick={() => setReminderSortOpt("important")}
                          className={`${
                            reminderSortOpt === "important"
                              ? "bg-cyan-200"
                              : "bg-white"
                          } rounded-md py-1 px-3 shadow-md`}
                        >
                          Important
                        </button>
                        <button
                          onClick={() => setReminderSortOpt("event")}
                          className={`${
                            reminderSortOpt === "event"
                              ? "bg-cyan-200"
                              : "bg-white"
                          } rounded-md py-1 px-3 shadow-md`}
                        >
                          Event
                        </button>
                        <button
                          onClick={() => setReminderSortOpt("today")}
                          className={`${
                            reminderSortOpt === "today"
                              ? "bg-cyan-200"
                              : "bg-white"
                          } rounded-md py-1 px-3 shadow-md`}
                        >
                          Today
                        </button>
                        <button
                          onClick={() => setReminderSortOpt("tomorrow")}
                          className={`${
                            reminderSortOpt === "tomorrow"
                              ? "bg-cyan-200"
                              : "bg-white"
                          } rounded-md py-1 px-3 shadow-md`}
                        >
                          Tomorrow
                        </button>
                        <button
                          onClick={() => setReminderSortOpt("month")}
                          className={`${
                            reminderSortOpt === "month"
                              ? "bg-cyan-200"
                              : "bg-white"
                          } rounded-md py-1 px-3 shadow-md`}
                        >
                          This Month
                        </button>
                        <button
                          onClick={() => setReminderSortOpt("week")}
                          className={`${
                            reminderSortOpt === "week"
                              ? "bg-cyan-200"
                              : "bg-white"
                          } rounded-md py-1 px-3 shadow-md`}
                        >
                          This Week
                        </button>
                        <button
                          onClick={() => setReminderSortOpt("past")}
                          className={`${
                            reminderSortOpt === "past"
                              ? "bg-cyan-200"
                              : "bg-white"
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
                    styles="pr-7"
                    value={listSort}
                    toggle={setListSort}
                  />
                  <Switch
                    title="Search"
                    styles="mt-3 pr-7"
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
                      <button
                        onClick={() => setListSortOpt("length")}
                        className={`${
                          listSortOpt === "length" ? "bg-cyan-300" : "bg-white"
                        } shadow-md rounded-md px-3 py-2`}
                      >
                        Number of Items
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
                  className="p-3"
                >
                  <Switch
                    title="Sort"
                    styles="mt-10"
                    value={taskSort}
                    toggle={setTaskSort}
                  />
                  <Switch
                    title="Search"
                    styles="mt-3"
                    value={taskSearch}
                    toggle={setTaskSearch}
                  />
                  {taskSort ? (
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setTaskSortOpt("title")}
                        className={`${
                          taskSortOpt === "title" ? "bg-cyan-300" : "bg-white"
                        } shadow-md rounded-md px-3 py-2`}
                      >
                        Title
                      </button>
                      <button
                        onClick={() => setTaskSortOpt("length")}
                        className={`${
                          taskSortOpt === "length" ? "bg-cyan-300" : "bg-white"
                        } shadow-md rounded-md px-3 py-2`}
                      >
                        Number of tasks
                      </button>
                    </div>
                  ) : null}
                  {taskSearch ? (
                    <input
                      type="text"
                      onChange={(e) => setTaskSearchTxt(e.target.value)}
                      placeholder="Search your tasks"
                      className="outline-none rounded-md shadow-md p-3 w-full"
                    />
                  ) : null}
                  <Tasks
                    taskSort={taskSort}
                    taskSortOpt={taskSortOpt}
                    taskSearch={taskSearch}
                    taskSearchTxt={taskSearchTxt}
                  />
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
                  <StaticStickies />
                </motion.div>
              )}
              {showCategory === "event" && (
                <motion.div
                  initial={{ x: "-10%", opacity: 0 }}
                  exit={{ x: "-10%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="relative"
                >
                  {events.length > 0 ? (
                    [...events]
                      .sort((a, b) => new Date(a.date) - new Date(b.date))
                      .map((event) => (
                        <div
                          key={event.id}
                          className={`p-3 rounded-md shadow-lg my-5 lg:my-0 relative pl-5 w-full`}
                        >
                          <button
                            className="absolute top-0 right-0"
                            onClick={() => setEvent(event)}
                          >
                            <MdOutlineOpenInNew />
                          </button>
                          <div
                            className={`${event.color} absolute left-0 top-0 bottom-0 w-2 rounded-md`}
                          ></div>
                          <p className="text-lg mb-2">
                            {formatTime(new Date(event.date))}
                          </p>
                          <p className="text-sm p-2font-semibold">
                            {event.summary}
                          </p>
                          <div className="mt-3">
                            {formatDbText(event.description || "").map(
                              (text, index) => (
                                <p
                                  key={index}
                                  className="text-[14px] font-semibold"
                                >
                                  {text}
                                </p>
                              )
                            )}
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="px-3">
                      <div className="rounded-md p-3 shadow-md my-5 flex justify-between items-center">
                        <div>
                          <h2 className="font-semibold mb-2">
                            You have no events
                          </h2>
                          <BiListPlus />
                        </div>
                        <div className="text-2xl p-2">
                          <IoIosAddCircle />
                        </div>
                      </div>
                    </div>
                  )}
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
