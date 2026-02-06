import { useContext, useState, useEffect } from "react";
import { IoIosAddCircle } from "react-icons/io";
import UserContext from "../../context/UserContext";
import DatesContext from "../../context/DatesContext";
import InteractiveContext from "../../context/InteractiveContext";
import Task from "./Task";

const Tasks = ({ taskSort, taskSortOpt, taskSearch, taskSearchTxt }) => {
  const { userTasks, preferences } = useContext(UserContext);
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

  return (
    <div className="mt-6 px-3">
      <div className="mx-auto max-w-6xl">
        {tasksToRender.length < 1 ? (
          <div className="min-h-[55vh] grid place-items-center">
            <div
              className={`
            w-full max-w-md rounded-3xl border shadow-2xl backdrop-blur-md p-5 sm:p-6
            ${
              preferences.darkMode
                ? "bg-[#161616]/90 border-white/10 text-white"
                : "bg-white/90 border-black/10 text-slate-900"
            }
          `}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`
                  grid place-items-center h-12 w-12 rounded-2xl border shadow-sm
                  ${
                    preferences.darkMode
                      ? "bg-emerald-500/15 border-emerald-300/20 text-emerald-100"
                      : "bg-emerald-50 border-emerald-200 text-emerald-700"
                  }
                `}
                  >
                    <MdOutlineCheckCircle className="text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">
                      No Tasks Yet
                    </h2>
                    <p
                      className={`text-sm mt-1 ${
                        preferences.darkMode
                          ? "text-white/60"
                          : "text-slate-500"
                      }`}
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
                ${
                  preferences.darkMode
                    ? "bg-white/10 border-white/10 hover:bg-white/15 text-white"
                    : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-700"
                }
              `}
                  aria-label="Add task"
                >
                  <IoIosAddCircle className="text-2xl" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {tasksToRender.map((task) => (
              <Task key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
