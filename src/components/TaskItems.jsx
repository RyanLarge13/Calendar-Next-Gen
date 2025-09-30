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

    try {
      const token = localStorage.getItem("authToken");
      await updateTaskTitle(task.id, newTitle, token);
      setUserTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, title: newTitle } : t))
      );
    } catch (err) {
      console.log(err);
      console.log("Error updating task title");
    }
  };

  return (
    <div>
      <div className="mb-2 bg-white rounded-md shadow-md p-3 flex justify-start items-center gap-x-3">
        <form className="w-full" onSubmit={(e) => updateTitle(e)}>
          <input
            onChange={(e) => setNewTitle(e.target.value)}
            value={newTitle}
            className="text-xl font-semibold w-full placeholder:text-black bg-transparent"
          />
        </form>
        <p className="font-semibold text-sm">
          {itemsCopy.filter((tsk) => tsk.complete).length}/{itemsCopy.length}{" "}
          complete
        </p>
      </div>
      <div className="mb-2 bg-white rounded-md shadow-md p-3 flex justify-start items-center gap-x-3">
        <button onClick={() => setSortOrder(2)}>
          <FaSortAlphaUp />
        </button>
        <button onClick={() => setSortOrder(3)}>
          <FaSortAlphaDownAlt />
        </button>
        <button onClick={() => setSortOrder(1)}>
          <FaSortAmountDown />
        </button>
        <button onClick={() => setSortOrder(4)}>
          <FaSortAmountUp />
        </button>
      </div>
      <div className="flex justify-between items-center mb-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addNewTaskItem();
          }}
          className="w-full mr-3"
        >
          <input
            type="text"
            className="rounded-md shadow-md px-3 py-2 outline-none w-full"
            placeholder="New Item"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
          />
        </form>
        <AiFillPlusCircle
          onClick={() => addNewTaskItem()}
          className="text-lg cursor-pointer"
        />
      </div>
      {itemsCopy.map((taskItem) => (
        <div
          key={taskItem.id}
          className="p-3 py-4 border-b border-b-slate-300 bg-white rounded-sm"
        >
          <label htmlFor={taskItem} className="flex">
            <input
              onChange={(e) => handleChecked(e, taskItem)}
              type="checkbox"
              value={taskItem.text}
              checked={taskItem.complete}
              className="text-black"
            />
            <div className=" ml-5 w-full flex justify-between items-center">
              <p className={`${taskItem.complete ? "line-through" : ""} mr-2`}>
                {taskItem.text}
              </p>
              <div onClick={() => removeTaskItem(taskItem)}>
                <AiFillCloseCircle />
              </div>
            </div>
          </label>
        </div>
      ))}
    </div>
  );
};

export default TaskItems;
