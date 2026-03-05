import { useContext, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import UserContext from "../../context/UserContext";

const TaskItem = ({
  taskItem,
  handleChecked,
  removeTaskItem,
  updateTaskItemText,
}) => {
  const { preferences } = useContext(UserContext);

  const [newTaskText, setNewTaskText] = useState(taskItem.text);

  return (
    <div
      key={taskItem.id}
      className={`
    group
    rounded-3xl border shadow-sm
    px-4 py-3
    flex items-center justify-between gap-3
    transition-all duration-200
    hover:shadow-md active:scale-[0.995]
    ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/40" : "bg-white border-black/10 hover:bg-white/80"}
  `}
    >
      <label
        htmlFor={taskItem.id}
        className="flex items-center w-full min-w-0 gap-3"
      >
        {/* Checkbox */}
        <span
          className={`
        grid place-items-center h-10 w-10 rounded-2xl border shadow-inner flex-shrink-0
        transition
        ${
          preferences.darkMode
            ? "bg-[#161616]/40 border-white/10 group-hover:bg-[#161616]/55"
            : "bg-black/[0.03] border-black/10 group-hover:bg-black/[0.05]"
        }
      `}
        >
          <input
            id={taskItem.id}
            onChange={(e) => handleChecked(e, taskItem)}
            type="checkbox"
            checked={taskItem.complete}
            className={`
          h-4 w-4 cursor-pointer
          accent-cyan-500
        `}
          />
        </span>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <input
            className={`
          w-full bg-transparent outline-none focus:outline-none
          text-sm font-semibold
          transition
          ${
            taskItem.complete
              ? preferences.darkMode
                ? "line-through text-white/35"
                : "line-through text-slate-400"
              : preferences.darkMode
                ? "text-white/85 placeholder:text-white/35"
                : "text-slate-800 placeholder:text-slate-400"
          }
        `}
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="New task…"
            onBlur={() => updateTaskItemText(taskItem, newTaskText)}
          />

          {/* Optional subtext row (nice touch for future metadata) */}
          <p
            className={`mt-1 text-[11px] font-semibold ${
              preferences.darkMode ? "text-white/45" : "text-slate-500"
            }`}
          >
            {taskItem.complete ? "Completed" : "Tap to edit • Enter to save"}
          </p>
        </div>
      </label>

      {/* Delete */}
      <button
        type="button"
        onClick={() => removeTaskItem(taskItem)}
        className={`
      grid place-items-center h-10 w-10 rounded-2xl border shadow-sm flex-shrink-0
      transition active:scale-[0.97]
      ${
        preferences.darkMode
          ? "bg-white/5 border-white/10 text-white/55 hover:text-rose-200 hover:bg-white/10"
          : "bg-black/[0.03] border-black/10 text-slate-500 hover:text-rose-600 hover:bg-black/[0.06]"
      }
    `}
        aria-label="Delete item"
        title="Delete"
      >
        <AiFillCloseCircle className="text-lg" />
      </button>
    </div>
  );
};

export default TaskItem;
