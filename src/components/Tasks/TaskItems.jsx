import { useContext, useEffect, useRef, useState } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import {
  FaSortAlphaDownAlt,
  FaSortAlphaUp,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import UserContext from "../../context/UserContext";
import { updateTasks, updateTaskTitle } from "../../utils/api";
import TaskItem from "./TaskItem";

const TaskItems = ({ task, styles = "" }) => {
  const { setUserTasks, preferences } = useContext(UserContext);

  const [itemsCopy, setItemsCopy] = useState(task.tasks);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTitle, setNewTitle] = useState(task.title);
  const [titleTracker, setTitleTracker] = useState(task.title);

  const taskItemInputRef = useRef(null);

  useEffect(() => {
    setItemsCopy(task.tasks);
  }, [task]);

  const addNewTaskItem = async () => {
    const newTask = {
      id: uuidv4(),
      text: newTaskText,
      complete: false,
      completedAt: null,
    };
    const newItems = [...itemsCopy, newTask];
    setItemsCopy(newItems);
    setNewTaskText("");

    if (taskItemInputRef.current) {
      taskItemInputRef.current.focus();
    }

    const update = {
      taskId: task.id,
      taskItems: newItems,
    };

    try {
      const token = localStorage.getItem("authToken");
      await updateTasks(token, [update]);

      setUserTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, tasks: newItems } : t)),
      );

      setItemsCopy(newItems);
    } catch (err) {
      console.log("Error adding new task item to your task");
      console.log(err);
    }
  };

  const handleChecked = async (e, taskItem) => {
    const newCheck = e.target.checked;
    const newItems = itemsCopy.map((itm) => {
      if (itm.id === taskItem.id) {
        return {
          ...itm,
          complete: newCheck,
          completedAt: newCheck ? new Date().toString() : null,
        };
      }
      return itm;
    });
    setItemsCopy(newItems);

    const update = {
      taskId: task.id,
      taskItems: newItems,
    };

    try {
      const token = localStorage.getItem("authToken");
      await updateTasks(token, [update]);

      setUserTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, tasks: newItems } : t)),
      );

      setItemsCopy(newItems);
    } catch (err) {
      console.log("Error adding new task item to your task");
      console.log(err);
    }
  };

  const removeTaskItem = async (taskItem) => {
    const newTasks = itemsCopy.filter((itm) => itm.id !== taskItem.id);
    setItemsCopy(newTasks);

    const newUpdate = {
      taskId: task.id,
      taskItems: newTasks,
    };

    try {
      const token = localStorage.getItem("authToken");
      await updateTasks(token, [newUpdate]);

      setUserTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, tasks: newTasks } : t)),
      );

      setItemsCopy(newItems);
    } catch (err) {
      console.log("Error updating task items when removing a task");
      console.log(err);
    }
  };

  const updateTitle = async (e) => {
    e.preventDefault();

    if (!newTitle) {
      return;
    }

    if (newTitle === titleTracker) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      await updateTaskTitle(task.id, newTitle, token);
      setTitleTracker(newTitle);
      setUserTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, title: newTitle } : t)),
      );
    } catch (err) {
      console.log(err);
      console.log("Error updating task title");
    }
  };

  const updateTaskItemText = async (myTask, newText) => {
    const newItems = itemsCopy.map((itm) => {
      if (itm.id === myTask.id) {
        return {
          ...itm,
          text: newText,
        };
      }
      return itm;
    });
    setItemsCopy(newItems);

    const update = {
      taskId: task.id,
      taskItems: newItems,
    };

    try {
      const token = localStorage.getItem("authToken");
      await updateTasks(token, [update]);

      setUserTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, tasks: newItems } : t)),
      );
    } catch (err) {
      console.log("Error adding new task item to your task");
      console.log(err);
    }
  };

  const updateEventReference = async () => {};

  const updateDateFor = async () => {};

  return (
    <div className="space-y-3">
      {/* Title + Progress */}
      <div
        className={`
      rounded-3xl border shadow-sm p-3
      flex items-center justify-between gap-3
      ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-white border-black/10"}
    `}
      >
        <form className="flex-1 min-w-0" onSubmit={updateTitle}>
          <input
            onChange={(e) => setNewTitle(e.target.value)}
            type="text"
            onBlur={updateTitle}
            value={newTitle}
            placeholder="Task title…"
            className={`
          w-full bg-transparent outline-none
          text-lg sm:text-xl font-semibold tracking-tight
          placeholder:font-semibold
          ${preferences.darkMode ? "text-white placeholder:text-white/40" : "text-slate-900 placeholder:text-slate-400"}
        `}
          />
        </form>

        <div
          className={`
            flex-shrink-0
            px-3 py-1.5 rounded-2xl border shadow-sm
            text-[11px] font-semibold ${itemsCopy.filter((tsk) => tsk.complete).length === itemsCopy.length ? "border-emerald-800 bg-emerald-950" : ""}
            ${preferences.darkMode ? "bg-white/5 border-white/10 text-white/70" : "bg-black/[0.03] border-black/10 text-slate-600"}
          `}
          title="Completed / Total"
        >
          {itemsCopy.filter((tsk) => tsk.complete).length}/{itemsCopy.length}
        </div>
      </div>

      {/* Sorting Buttons */}
      <div
        className={`
      rounded-3xl border shadow-sm p-3
      flex items-center gap-2 flex-wrap
      ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-white border-black/10"}
    `}
      >
        <p
          className={`text-[11px] font-semibold tracking-wide mr-1 ${
            preferences.darkMode ? "text-white/55" : "text-slate-500"
          }`}
        >
          Sort
        </p>

        <button
          onClick={() => setSortOrder(2)}
          className={`
        h-10 w-10 grid place-items-center rounded-2xl border shadow-sm transition
        hover:shadow-md active:scale-[0.97]
        ${
          preferences.darkMode
            ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
            : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"
        }
      `}
          aria-label="Sort A to Z"
          title="A → Z"
        >
          <FaSortAlphaUp />
        </button>

        <button
          onClick={() => setSortOrder(3)}
          className={`
        h-10 w-10 grid place-items-center rounded-2xl border shadow-sm transition
        hover:shadow-md active:scale-[0.97]
        ${
          preferences.darkMode
            ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
            : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"
        }
      `}
          aria-label="Sort Z to A"
          title="Z → A"
        >
          <FaSortAlphaDownAlt />
        </button>

        <div
          className={`h-6 w-px ${preferences.darkMode ? "bg-white/10" : "bg-black/10"}`}
        />

        <button
          onClick={() => setSortOrder(1)}
          className={`
        h-10 w-10 grid place-items-center rounded-2xl border shadow-sm transition
        hover:shadow-md active:scale-[0.97]
        ${
          preferences.darkMode
            ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
            : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"
        }
      `}
          aria-label="Sort by largest first"
          title="Largest first"
        >
          <FaSortAmountDown />
        </button>

        <button
          onClick={() => setSortOrder(4)}
          className={`
        h-10 w-10 grid place-items-center rounded-2xl border shadow-sm transition
        hover:shadow-md active:scale-[0.97]
        ${
          preferences.darkMode
            ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
            : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"
        }
      `}
          aria-label="Sort by smallest first"
          title="Smallest first"
        >
          <FaSortAmountUp />
        </button>

        <div className="flex-1" />
      </div>

      {/* New Item Input */}
      <div
        className={`
      rounded-3xl border shadow-sm p-2
      flex items-center gap-3
      ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-white border-black/10"}
    `}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addNewTaskItem();
          }}
          className="flex-1 min-w-0"
        >
          <input
            ref={taskItemInputRef}
            type="text"
            className={`
          w-full px-4 py-3 rounded-2xl border shadow-inner outline-none text-sm font-semibold
          transition
          ${
            preferences.darkMode
              ? "bg-[#161616]/40 border-white/10 text-white placeholder:text-white/40 focus:bg-[#161616]/55"
              : "bg-black/[0.03] border-black/10 text-slate-900 placeholder:text-slate-400 focus:bg-black/[0.05]"
          }
        `}
            placeholder="New item…"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
          />
        </form>

        <button
          type="button"
          onClick={() => addNewTaskItem()}
          className={`
        h-10 w-10 grid place-items-center rounded-2xl border shadow-sm transition
        hover:shadow-md active:scale-[0.97]
        ${
          preferences.darkMode
            ? "bg-cyan-500/15 border-cyan-300/20 text-cyan-100 hover:bg-cyan-500/20"
            : "bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100"
        }
      `}
          aria-label="Add item"
        >
          <AiFillPlusCircle className="text-xl" />
        </button>
      </div>

      {/* Task Items */}
      <div className={`space-y-2 pb-1 ${styles}`}>
        {itemsCopy.map((taskItem) => (
          <TaskItem
            key={taskItem.id}
            taskItem={taskItem}
            handleChecked={handleChecked}
            removeTaskItem={removeTaskItem}
            updateTaskItemText={updateTaskItemText}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskItems;
