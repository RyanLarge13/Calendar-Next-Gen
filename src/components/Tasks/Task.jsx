import { useContext, useState } from "react";
import { BsCheck2Circle, BsShareFill, BsTrashFill } from "react-icons/bs";
import { FaPaintBrush } from "react-icons/fa";
import UserContext from "../../context/UserContext";
import { API_UpdateTaskColor, deleteTask, updateTasks } from "../../utils/api";
import EditColor from "../Misc/EditColor";
import TaskItems from "../Tasks/TaskItems";
import { MdOutlineClear, MdOutlineClearAll } from "react-icons/md";

const Task = ({ task }) => {
  const { preferences, setUserTasks, userTasks, setSystemNotif } =
    useContext(UserContext);

  const [changeColor, setChangeColor] = useState(false);
  const [color, setColor] = useState(task.color);

  // Deleting task
  const confirmDeleteTask = () => {
    const newConfirmation = {
      show: true,
      title: "Delete Task",
      text: "Are you sure you want to delete this task?",
      color: "bg-red-300",
      hasCancel: true,
      actions: [
        { text: "cancel", func: () => setSystemNotif({ show: false }) },
        { text: "delete", func: () => deleteMyTask() },
      ],
    };
    setSystemNotif(newConfirmation);
  };

  const confirmClearAllTaskItems = () => {
    if (task.tasks?.length < 1) {
      return;
    }
    const newConfirmation = {
      show: true,
      title: "Clear All Task Items",
      text: "Are you sure you want to clear all of the task items?",
      color: "bg-red-300",
      hasCancel: true,
      actions: [
        { text: "cancel", func: () => setSystemNotif({ show: false }) },
        { text: "clear items", func: () => clearAllTasks() },
      ],
    };
    setSystemNotif(newConfirmation);
  };

  const deleteMyTask = () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return;
      }
      deleteTask(token, task.id)
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
  // Deleting task

  const updateColor = async () => {
    setChangeColor(false);

    if (color === task.color) {
      return;
    }

    setUserTasks((prev) => {
      const newTasks = prev.map((t) =>
        t.id === task.id ? { ...t, color: color } : t,
      );
      return newTasks;
    });

    try {
      const token = localStorage.getItem("authToken");

      await API_UpdateTaskColor(token, task.id, color);
    } catch (err) {
      console.log("Error updating task color");
      console.log(err);
    }
  };

  const markAllComplete = async () => {
    const now = new Date();
    const newItems = task.tasks.map((t) => ({
      ...t,
      complete: true,
      completedAt: now,
    }));

    setUserTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? {
              ...t,
              tasks: newItems,
            }
          : t,
      ),
    );

    const update = {
      taskId: task.id,
      taskItems: newItems,
    };

    try {
      const token = localStorage.getItem("authToken");
      await updateTasks(token, [update]);
    } catch (err) {
      console.log("Error updating all tasks to be completed");
      console.log(err);
    }
  };

  const clearAllTasks = async () => {
    const newTasks = [];

    const update = {
      taskId: task.id,
      taskItems: newTasks,
    };

    setUserTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, tasks: newTasks } : t)),
    );

    try {
      const token = localStorage.getItem("authToken");
      await updateTasks(token, [update]);
    } catch (err) {
      console.log("Error clearing users tasks");
      console.log(err);
    }
  };

  return (
    <div
      key={task.id}
      className={`
              relative overflow-hidden
              rounded-3xl border shadow-sm transition-all
              ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10 hover:bg-white/7"
                  : "bg-white border-black/10 hover:bg-black/[0.02]"
              }
            `}
    >
      {/* Color Changer */}
      {changeColor ? (
        <EditColor save={updateColor} color={color} setColor={setColor} />
      ) : null}

      {/* Accent strip (task.color used tastefully) */}
      <div className={`${color} absolute left-0 top-0 bottom-0 w-2`} />

      {/* Card header */}
      <div
        className={`
                px-4 py-3 pl-6 flex justify-between items-center
                border-b
                ${preferences.darkMode ? "border-white/10" : "border-black/10"}
              `}
      >
        <p
          className={`text-xs font-semibold ${
            preferences.darkMode ? "text-white/60" : "text-slate-500"
          }`}
        >
          {new Date(task.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={confirmClearAllTaskItems}
            type="button"
            className={`
                    grid place-items-center h-9 w-9 rounded-2xl border shadow-sm transition active:scale-95
                    ${
                      preferences.darkMode
                        ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
                        : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"
                    }
                  `}
            aria-label="Mark All Complete"
          >
            <MdOutlineClearAll />
          </button>
          <button
            onClick={markAllComplete}
            type="button"
            className={`
                    grid place-items-center h-9 w-9 rounded-2xl border shadow-sm transition active:scale-95
                    ${
                      preferences.darkMode
                        ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
                        : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"
                    }
                  `}
            aria-label="Mark All Complete"
          >
            <BsCheck2Circle />
          </button>
          <button
            type="button"
            className={`
                    grid place-items-center h-9 w-9 rounded-2xl border shadow-sm transition active:scale-95
                    ${
                      preferences.darkMode
                        ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
                        : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"
                    }
                  `}
            aria-label="Share"
          >
            <BsShareFill />
          </button>

          <button
            type="button"
            onClick={() => setChangeColor((prev) => !prev)}
            className={`
                    grid place-items-center h-9 w-9 rounded-2xl border shadow-sm transition active:scale-95
                    ${
                      preferences.darkMode
                        ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
                        : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"
                    }
                  `}
            aria-label="Change color"
          >
            <FaPaintBrush />
          </button>

          <button
            type="button"
            onClick={() => confirmDeleteTask()}
            className={`
                    grid place-items-center h-9 w-9 rounded-2xl border shadow-sm transition active:scale-95
                    ${
                      preferences.darkMode
                        ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/60 hover:text-rose-300"
                        : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-500 hover:text-rose-500"
                    }
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
                  ${
                    preferences.darkMode
                      ? "border-white/10 bg-white/5"
                      : "border-black/10 bg-white"
                  }
                `}
        >
          <TaskItems
            task={task}
            styles={"max-h-80 overflow-y-auto scrollbar-hide"}
          />
        </div>
      </div>
    </div>
  );
};

export default Task;
