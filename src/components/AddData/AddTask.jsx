import { useContext, useRef, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { BsFillCalendarPlusFill } from "react-icons/bs";
import { MdFreeCancellation } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { colors } from "../../constants.js";
import DatesContext from "../../context/DatesContext.jsx";
import InteractiveContext from "../../context/InteractiveContext.jsx";
import UserContext from "../../context/UserContext.jsx";
import { createTask } from "../../utils/api.js";
import Color from "../Misc/Color.jsx";

const AddTask = () => {
  const { setType, setAddNewEvent, setMenu, setShowCategory } =
    useContext(InteractiveContext);
  const { string, setOpenModal } = useContext(DatesContext);
  const { user, setUserTasks, preferences } = useContext(UserContext);

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("");

  const inputRef = useRef(null);

  const addTask = (e) => {
    e.preventDefault();
    const newTask = {
      id: uuidv4(),
      text: title,
      complete: false,
      completedAt: null,
    };
    setTasks((prev) => [...prev, newTask]);
    setTitle("");

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const removeTask = (taskId) => {
    const newTaskList = tasks.filter((tsk) => tsk.id !== taskId);
    setTasks(newTaskList);
  };

  const handleChecked = (e, taskId) => {
    if (e.target.checked) {
      const updatedTasks = tasks.map((tsk) => {
        if (tsk.id === taskId) {
          return { ...tsk, complete: true, completedAt: new Date().toString() };
        }
        return tsk;
      });
      setTasks(updatedTasks);
    }
    if (!e.target.checked) {
      const updatedTasks = tasks.map((tsk) => {
        if (tsk.id === taskId) {
          return { ...tsk, complete: false, completedAt: null };
        }
        return tsk;
      });
      setTasks(updatedTasks);
    }
  };

  const addTasks = () => {
    if (!checksPassed()) {
      return;
    }
    const token = localStorage.getItem("authToken");
    const newTaskSet = {
      date: string,
      color,
      tasks,
      completed: false,
      completedDate: null,
      userId: user.id,
    };
    createTask(token, newTaskSet)
      .then((res) => {
        setAddNewEvent(false);
        setOpenModal(false);
        setUserTasks((prev) => [...prev, res.data.task]);
        setMenu(true);
        setShowCategory("task");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const checksPassed = () => {
    return true;
  };

  return (
    <div className="flex flex-col justify-between h-screen px-3 pb-3 sm:px-6 pt-10">
      <div className="w-full max-w-xl">
        {/* Color picker */}
        <div className="flex flex-wrap items-center justify-center gap-1 py-2 mb-4 mt-6 sm:mt-10">
          {colors.map((item, index) => (
            <Color
              key={index}
              string={item.color}
              color={color}
              setColor={setColor}
              index={index}
            />
          ))}
        </div>

        {/* Title / Task input */}
        <form onSubmit={addTask}>
          <input
            ref={inputRef}
            value={title}
            placeholder="Task"
            onChange={(e) => setTitle(e.target.value)}
            className={`
          w-full bg-transparent text-3xl h-20 sm:text-4xl font-semibold tracking-tight
          outline-none placeholder:opacity-60
          ${
            preferences.darkMode
              ? "text-white placeholder:text-gray-300"
              : "text-slate-900 placeholder:text-slate-500"
          }
        `}
          />
        </form>

        {/* Add button */}
        <button
          type="submit"
          onClick={addTask}
          className="
        w-full mt-3 rounded-2xl py-3 text-sm font-semibold text-white
        bg-gradient-to-tr from-lime-400 to-emerald-500
        shadow-md hover:shadow-lg hover:scale-[1.015]
        active:scale-[0.97] transition-all duration-200
      "
        >
          Add
        </button>

        {/* Task list */}
        <div
          className={`
        mt-6 mb-20 max-h-[52vh] overflow-y-auto scrollbar-hide
        rounded-2xl border shadow-sm p-2 sm:p-3
        ${
          preferences.darkMode
            ? "bg-white/5 border-white/10"
            : "bg-white border-black/10"
        }
      `}
        >
          {tasks.length > 0 ? (
            <div className="space-y-2">
              {tasks.map((task, index) => (
                <div
                  key={index}
                  className={`
                rounded-2xl border px-4 py-3 shadow-sm transition-all
                ${
                  preferences.darkMode
                    ? "border-white/10 bg-white/5 hover:bg-white/7"
                    : "border-black/10 bg-white hover:bg-black/[0.02]"
                }
              `}
                >
                  <label className="flex items-center gap-3 cursor-pointer">
                    {/* Checkbox */}
                    <input
                      onChange={(e) => handleChecked(e, task.id)}
                      type="checkbox"
                      checked={!!task.complete}
                      className={`
                    h-5 w-5 rounded-md border transition
                    accent-emerald-500
                    ${
                      preferences.darkMode
                        ? "border-white/20 bg-white/10"
                        : "border-black/20 bg-white"
                    }
                    focus:outline-none focus:ring-2 focus:ring-emerald-500/20
                  `}
                    />

                    {/* Text + actions */}
                    <div className="w-full flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {/* Color dot */}
                        <span
                          className={`${color} h-3 w-3 rounded-full ring-1 ring-black/10`}
                        />

                        <p
                          className={`text-sm font-semibold ${
                            task.complete ? "line-through opacity-50" : ""
                          }`}
                        >
                          {task.text}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeTask(task.id)}
                        className={`
                      rounded-xl p-1 transition active:scale-95
                      ${
                        preferences.darkMode
                          ? "hover:bg-white/10"
                          : "hover:bg-black/[0.04]"
                      }
                    `}
                        aria-label="Remove task"
                      >
                        <AiFillCloseCircle className="text-xl text-rose-500/90 hover:text-rose-500" />
                      </button>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <p
                className={`text-sm font-semibold ${
                  preferences.darkMode ? "text-white/60" : "text-slate-500"
                }`}
              >
                No tasks yet
              </p>
              <p
                className={`text-xs mt-1 ${
                  preferences.darkMode ? "text-white/40" : "text-slate-400"
                }`}
              >
                Add one above to get started.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex justify-between items-center w-full max-w-xl pb-3">
        <button
          onClick={() => {
            setType(null);
            setAddNewEvent(false);
          }}
          className="
        grid place-items-center rounded-2xl p-3 shadow-lg transition
        hover:scale-[0.98] active:scale-95
        bg-gradient-to-tr from-red-500 to-rose-500 text-white
      "
          aria-label="Cancel"
        >
          <MdFreeCancellation className="text-xl" />
        </button>

        <button
          onClick={() => addTasks()}
          className="
        grid place-items-center rounded-2xl p-3 shadow-lg transition
        hover:scale-[0.98] active:scale-95
        bg-gradient-to-tr from-lime-400 to-emerald-500 text-white
      "
          aria-label="Save tasks"
        >
          <BsFillCalendarPlusFill className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default AddTask;
