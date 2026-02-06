import { useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";

const TaskItem = ({
  taskItem,
  handleChecked,
  removeTaskItem,
  updateTaskItemText,
}) => {
  const [newTaskText, setNewTaskText] = useState(taskItem.text);

  return (
    <div
      key={taskItem.id}
      className="bg-white rounded-xl shadow-sm p-3 flex items-center justify-between hover:shadow-md transition-shadow"
    >
      <label htmlFor={taskItem.id} className="flex items-center w-full">
        <input
          onChange={(e) => handleChecked(e, taskItem)}
          type="checkbox"
          value={newTaskText}
          checked={taskItem.complete}
          className="mr-3 h-4 w-4 accent-blue-500"
        />
        <input
          className={`flex-1 placeholder:text-gray-500 bg-transparent outline-none focus:outline-none w-full ${
            taskItem.complete ? "line-through text-gray-400" : "text-gray-700"
          }`}
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder={newTaskText}
          onBlur={() => updateTaskItemText(taskItem, newTaskText)}
        />
      </label>
      <button
        onClick={() => removeTaskItem(taskItem)}
        className="text-gray-400 hover:text-red-500 transition-colors"
      >
        <AiFillCloseCircle />
      </button>
    </div>
  );
};

export default TaskItem;
