import { useState, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { AiFillCloseCircle } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import { BsFillSaveFill } from "react-icons/bs";
import { createTask } from "../utils/api.js";
import InteractiveContext from "../context/InteractiveContext";
import DatesContext from "../context/DatesContext";
import UserContext from "../context/UserContext";

const AddTask = () => {
  const { setType, setAddNewEvent } = useContext(InteractiveContext);
  const { string } = useContext(DatesContext);
  const { user, setUserTasks } = useContext(UserContext);

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const addTask = (e) => {
    e.preventDefault();
    const newTask = {
      id: uuidv4(),
      text: title,
      complete: false,
    };
    setTasks((prev) => [...prev, newTask]);
    setTitle("");
  };

  const removeTask = (taskId) => {
    const newTaskList = tasks.filter((tsk) => tsk.id !== taskId);
    setTasks(newTaskList);
  };

  const handleChecked = (e, taskId) => {
    if (e.target.checked) {
      const updatedTasks = tasks.map((tsk) => {
        if (tsk.id === taskId) {
          return { ...tsk, complete: true };
        }
        return tsk;
      });
      setTasks(updatedTasks);
    }
    if (!e.target.checked) {
      const updatedTasks = tasks.map((tsk) => {
        if (tsk.id === taskId) {
          return { ...tsk, complete: false };
        }
        return tsk;
      });
      setTasks(updatedTasks);
    }
  };

  const addTasks = () => {
    const token = localStorage.getItem("authToken");
    const newTaskSet = {
      date: string,
      tasks,
      completed: false,
      completedDate: "",
      userId: user.id,
    };
    createTask(token, newTaskSet)
      .then((res) => {
        setUserTasks((prev) => [...prev, res.data.tasks]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <form onSubmit={addTask}>
        <input
          value={title}
          placeholder="Task"
          onChange={(e) => setTitle(e.target.value)}
          className="w-full focus:outline-none text-4xl p-2 mt-10 mb-5"
        />
      </form>
      <button
        type="submit"
        onClick={addTask}
        className="w-full text-xs underline rounded-md shadow-md bg-gradient-to-r from-green-300 to-lime-200 py-2"
      >
        Add
      </button>
      <div className="max-h-[500px] overflow-y-auto scrollbar-hide">
        {tasks.length > 0 &&
          tasks.map((task, index) => (
            <div key={index} className="p-3 py-4 border-b border-b-slate-300">
              <label htmlFor={task} className="flex">
                <input
                  onChange={(e) => handleChecked(e, task.id)}
                  type="checkbox"
                  value={task.text}
                  className="text-black"
                />
                <div className=" ml-5 w-full flex justify-between items-center">
                  <p
                    className={`${
                      task.complete === true
                        ? "line-through text-slate-400"
                        : ""
                    } mr-2`}
                  >
                    {task.text}
                  </p>
                  <div>
                    <AiFillCloseCircle onClick={() => removeTask(task.id)} />
                  </div>
                </div>
              </label>
            </div>
          ))}
      </div>
      <div className="absolute bottom-4 right-4 left-4 text-xs">
        <button
          onClick={() => {}}
          className="w-full px-3 py-2 rounded-md shadow-md bg-gradient-to-r from-lime-200 to-green-200 underline"
        >
          save
        </button>
        <button
          onClick={() => {
            setType(null);
            setAddNewEvent(false);
          }}
          className="w-full mt-3 px-3 py-2 rounded-md shadow-md bg-gradient-to-tr from-red-200 to-rose-200 underline"
        >
          cancel
        </button>
      </div>
    </div>
  );
};

export default AddTask;
