import { useContext, useState, useEffect } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { BsShareFill, BsTrashFill } from "react-icons/bs";
import { deleteTask } from "../utils/api";
import TaskItems from "./TaskItems";
import UserContext from "../context/UserContext";
import DatesContext from "../context/DatesContext";
import InteractiveContext from "../context/InteractiveContext";

const Tasks = ({ taskSort, taskSortOpt, taskSearch, taskSearchTxt }) => {
  const { userTasks, setUserTasks, setSystemNotif, preferences } =
    useContext(UserContext);
  const { setType, setAddNewEvent, setMenu } = useContext(InteractiveContext);
  const { string, setString, setOpenModal } = useContext(DatesContext);

  const [tasksToRender, setTasksToRender] = useState(userTasks);

  useEffect(() => {
    if (taskSort && taskSortOpt) {
      switch (taskSort) {
        case "title":
          {
            const newTsks = [...userTasks];
            const sortedTsks = newTsks.sort((a, b) =>
              a.title.localeCompare(b.title),
            );
            setTasksToRender(sortedTsks);
          }
          break;
        case "length":
          {
            const newTsks = [...userTasks];
            const sortedTsks = newTsks.sort(
              (a, b) => a.tasks.length > b.tasks.length,
            );
            setTasksToRender(sortedTsks);
          }
          break;
        default:
          setTasksToRender(userTasks);
          break;
      }
    } else {
      setTasksToRender(userTasks);
    }
  }, [taskSort, taskSortOpt]);

  useEffect(() => {
    if (taskSearch && taskSearchTxt) {
      const newTasks = userTasks.filter((tsk) =>
        tsk.title.includes(taskSearchTxt),
      );
      setTasksToRender(newTasks);
    } else {
      setTasksToRender(userTasks);
    }
  }, [taskSearch, taskSearchTxt]);

  const openModalAndSetType = () => {
    if (!string) {
      setString(dateObj.toLocaleDateString());
    }
    setType("task");
    setMenu(false);
    setOpenModal(true);
    setAddNewEvent(true);
  };

  const confirmDeleteTask = (taskId) => {
    const newConfirmation = {
      show: true,
      title: "Delete Task",
      text: "Are you sure you want to delete this task?",
      color: "bg-red-300",
      hasCancel: true,
      actions: [
        { text: "cancel", func: () => setSystemNotif({ show: false }) },
        { text: "delete", func: () => deleteMyTask(taskId) },
      ],
    };
    setSystemNotif(newConfirmation);
  };

  const deleteMyTask = (taskId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return;
      }
      deleteTask(token, taskId)
        .then((res) => {
          setSystemNotif({ show: false });
          const deletedTaskId = res.data.deletedTaskId;
          const newTasks = userTasks.filter((tsk) => tsk.id !== deletedTaskId);
          setUserTasks(newTasks);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="mt-6 px-3 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {tasksToRender.length < 1 ? (
          <div className="min-h-[55vh] grid place-items-center">
            <div
              className={`
            w-full max-w-md rounded-3xl border shadow-2xl backdrop-blur-md p-5 sm:p-6
            ${preferences.darkMode ? "bg-[#161616]/90 border-white/10 text-white" : "bg-white/90 border-black/10 text-slate-900"}
          `}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`
                  grid place-items-center h-12 w-12 rounded-2xl border shadow-sm
                  ${preferences.darkMode ? "bg-emerald-500/15 border-emerald-300/20 text-emerald-100" : "bg-emerald-50 border-emerald-200 text-emerald-700"}
                `}
                  >
                    <MdOutlineCheckCircle className="text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">
                      No Tasks Yet
                    </h2>
                    <p
                      className={`text-sm mt-1 ${preferences.darkMode ? "text-white/60" : "text-slate-500"}`}
                    >
                      Start by adding your first task list.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => openModalAndSetType()}
                  className={`
                grid place-items-center h-11 w-11 rounded-2xl border shadow-md transition
                hover:scale-[1.02] active:scale-[0.97]
                ${preferences.darkMode ? "bg-white/10 border-white/10 hover:bg-white/15 text-white" : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-700"}
              `}
                  aria-label="Add task"
                >
                  <IoIosAddCircle className="text-2xl" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {tasksToRender.map((task) => (
              <div
                key={task.id}
                className={`
              relative overflow-hidden
              rounded-3xl border shadow-sm transition-all
              ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/7" : "bg-white border-black/10 hover:bg-black/[0.02]"}
            `}
              >
                {/* Accent strip (task.color used tastefully) */}
                <div
                  className={`${task.color} absolute left-0 top-0 bottom-0 w-2`}
                />

                {/* Card header */}
                <div
                  className={`
                px-4 py-3 pl-6 flex justify-between items-center
                border-b
                ${preferences.darkMode ? "border-white/10" : "border-black/10"}
              `}
                >
                  <p
                    className={`text-xs font-semibold ${preferences.darkMode ? "text-white/60" : "text-slate-500"}`}
                  >
                    {new Date(task.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className={`
                    grid place-items-center h-9 w-9 rounded-2xl border shadow-sm transition active:scale-95
                    ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70" : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"}
                  `}
                      aria-label="Share"
                    >
                      <BsShareFill />
                    </button>

                    <button
                      type="button"
                      onClick={() => confirmDeleteTask(task.id)}
                      className={`
                    grid place-items-center h-9 w-9 rounded-2xl border shadow-sm transition active:scale-95
                    ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/60 hover:text-rose-300" : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-500 hover:text-rose-500"}
                  `}
                      aria-label="Delete task"
                    >
                      <BsTrashFill />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 pl-6">
                  <div
                    className={`
                  rounded-2xl border shadow-sm p-3
                  ${preferences.darkMode ? "border-white/10 bg-white/5" : "border-black/10 bg-white"}
                `}
                  >
                    <TaskItems task={task} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
