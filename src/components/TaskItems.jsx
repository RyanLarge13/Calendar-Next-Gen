import { useState, useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { AiFillCloseCircle, AiFillPlusCircle } from "react-icons/ai";
import {
  FaSortAlphaDownAlt,
  FaSortAlphaUp,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import InteractiveContext from "../context/InteractiveContext";
import { updateTaskTitle } from "../utils/api";
import UserContext from "../context/UserContext";

const TaskItems = ({ task }) => {
  const { setTaskUpdates } = useContext(InteractiveContext);
  const { setUserTasks } = useContext(UserContext);

  const [itemsCopy, setItemsCopy] = useState(task.tasks);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTitle, setNewTitle] = useState(task.title);
  const [titleTracker, setTitleTracker] = useState(task.title);

  useEffect(() => {
    console.log(task);
  }, []);

  const update = (newItems) => {
    const newUpdate = {
      taskId: task.id,
      taskItems: newItems,
    };
    setTaskUpdates((updates) => {
      const includes = updates.some((u) => u.taskId === task.id);
      let updatedUpdates;
      if (includes) {
        updatedUpdates = updates.map((u) => {
          if (u.taskId === newUpdate.taskId) {
            return newUpdate;
          } else {
            return u;
          }
        });
      } else {
        updatedUpdates = [...updates, newUpdate];
      }
      return updatedUpdates;
    });
  };

  const addNewTaskItem = () => {
    const newTask = {
      id: uuidv4(),
      text: newTaskText,
      complete: false,
    };
    const newItems = [...itemsCopy, newTask];
    setItemsCopy(newItems);
    setNewTaskText("");
    update(newItems);
  };

  const handleChecked = (e, myTask) => {
    const newCheck = e.target.checked;
    const newItems = itemsCopy.map((itm) => {
      if (itm.id === myTask.id) {
        return { ...itm, complete: newCheck };
      }
      return itm;
    });
    setItemsCopy(newItems);
    update(newItems);
  };

  const removeTaskItem = (myTask) => {
    const newTasks = itemsCopy.filter((itm) => itm.id !== myTask.id);
    setItemsCopy(newTasks);
    update(newTasks);
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
        prev.map((t) => (t.id === task.id ? { ...t, title: newTitle } : t))
      );
    } catch (err) {
      console.log(err);
      console.log("Error updating task title");
    }
  };

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
      <div className="space-y-2">
        {itemsCopy.map((taskItem) => (
          <div
            key={taskItem.id}
            className="bg-white rounded-xl shadow-sm p-3 flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <label htmlFor={taskItem.id} className="flex items-center w-full">
              <input
                onChange={(e) => handleChecked(e, taskItem)}
                type="checkbox"
                value={taskItem.text}
                checked={taskItem.complete}
                className="mr-3 h-4 w-4 accent-blue-500"
              />
              <p
                className={`flex-1 ${
                  taskItem.complete
                    ? "line-through text-gray-400"
                    : "text-gray-700"
                }`}
              >
                {taskItem.text}
              </p>
            </label>
            <button
              onClick={() => removeTaskItem(taskItem)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <AiFillCloseCircle />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskItems;
