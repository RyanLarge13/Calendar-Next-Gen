import { useContext, useRef, useState } from "react";
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
  const { setUserTasks } = useContext(UserContext);

  const [itemsCopy, setItemsCopy] = useState(task.tasks);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTitle, setNewTitle] = useState(task.title);
  const [titleTracker, setTitleTracker] = useState(task.title);

  const taskItemInputRef = useRef(null);

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

  const handleChecked = async (e, myTask) => {
    const newCheck = e.target.checked;
    const newItems = itemsCopy.map((itm) => {
      if (itm.id === myTask.id) {
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

  const removeTaskItem = async (myTask) => {
    const newTasks = itemsCopy.filter((itm) => itm.id !== myTask.id);
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
      <div className="bg-white rounded-2xl shadow-md p-4 flex justify-between items-center">
        <form className="w-full" onSubmit={updateTitle}>
          <input
            onChange={(e) => setNewTitle(e.target.value)}
            type="text"
            onBlur={updateTitle}
            value={newTitle}
            className="text-xl font-semibold w-full placeholder:text-gray-500 bg-transparent outline-none focus:outline-none"
          />
        </form>
        <p className="font-semibold text-sm text-gray-500 whitespace-nowrap ml-3">
          {itemsCopy.filter((tsk) => tsk.complete).length}/{itemsCopy.length}
        </p>
      </div>

      {/* Sorting Buttons */}
      <div className="bg-white rounded-2xl shadow-md p-3 flex justify-around items-center text-gray-500">
        <button onClick={() => setSortOrder(2)} className="hover:text-blue-500">
          <FaSortAlphaUp />
        </button>
        <button onClick={() => setSortOrder(3)} className="hover:text-blue-500">
          <FaSortAlphaDownAlt />
        </button>
        <button onClick={() => setSortOrder(1)} className="hover:text-blue-500">
          <FaSortAmountDown />
        </button>
        <button onClick={() => setSortOrder(4)} className="hover:text-blue-500">
          <FaSortAmountUp />
        </button>
      </div>

      {/* New Item Input */}
      <div className="flex items-center gap-x-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addNewTaskItem();
          }}
          className="flex-1"
        >
          <input
            ref={taskItemInputRef}
            type="text"
            className="rounded-xl shadow-md px-4 py-2 outline-none w-full focus:ring-2 focus:ring-blue-400"
            placeholder="New Item"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
          />
        </form>
        <AiFillPlusCircle
          onClick={() => addNewTaskItem()}
          className="text-2xl text-blue-500 cursor-pointer hover:scale-110 transition-transform"
        />
      </div>

      {/* Task Items */}
      <div className={`space-y-2 ${styles}`}>
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
