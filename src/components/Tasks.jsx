import { useContext, useState, useEffect } from "react";
import { IoIosAddCircle } from "react-icons/io";
import {
  BsListTask,
  BsPenFill,
  BsShareFill,
  BsTrashFill,
} from "react-icons/bs";
import { deleteTask } from "../utils/api";
import TaskItems from "./TaskItems";
import UserContext from "../context/UserContext";
import DatesContext from "../context/DatesContext";
import InteractiveContext from "../context/InteractiveContext";

const Tasks = ({ taskSort, taskSortOpt, taskSearch, taskSearchTxt }) => {
  const { userTasks, setUserTasks, setSystemNotif } = useContext(UserContext);
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
              a.title.localeCompare(b.title)
            );
            setTasksToRender(sortedTsks);
          }
          break;
        case "length":
          {
            const newTsks = [...userTasks];
            const sortedTsks = newTsks.sort(
              (a, b) => a.tasks.length > b.tasks.length
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
        tsk.title.includes(taskSearchTxt)
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

  const confirmDeleteTask = (taskId) => {
    const newConfirmation = {
      show: true,
      title: "Delete Task",
      text: "Are you sure you want to delete this task?",
      color: "bg-red-300",
      hasCancel: true,
      actions: [
        { text: "cancel", func: () => setSystemNotif({ show: false }) },
        { text: "delete", func: () => deleteMyTask(taskId) },
      ],
    };
    setSystemNotif(newConfirmation);
  };

  const deleteMyTask = (taskId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        return;
      }
      deleteTask(token, taskId)
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

  return (
    <div
      className={`${
        tasksToRender.length < 1 ? "" : "grid"
      } grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10`}
    >
      {tasksToRender.length < 1 ? (
        <div className="flex h-[50vh] justify-center items-center">
          <div className="w-80 rounded-2xl p-6 shadow-lg bg-gradient-to-r from-lime-300 via-emerald-300 to-green-400 text-white">
            <div className="flex justify-between items-center">
              <div className="flex flex-col items-start">
                <h2 className="text-lg font-semibold mb-2">No Tasks Yet</h2>
                <p className="text-sm opacity-90">
                  Start by adding your first task.
                </p>
              </div>
              <button
                onClick={() => openModalAndSetType()}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <IoIosAddCircle className="text-4xl text-white drop-shadow" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        tasksToRender.map((task) => (
          <div
            key={task.id}
            className={`p-4 rounded-xl shadow-md ${task.color} text-black transition hover:shadow-lg`}
          >
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-600">
                  {new Date(task.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <div className="flex items-center gap-3 text-gray-500">
                  <button
                    onClick={() => editTitle(task)}
                    className="hover:text-blue-500 transition-colors"
                  >
                    <BsPenFill />
                  </button>
                  <button className="hover:text-emerald-500 transition-colors">
                    <BsShareFill />
                  </button>
                  <button
                    onClick={() => confirmDeleteTask(task.id)}
                    className="hover:text-rose-500 transition-colors"
                  >
                    <BsTrashFill />
                  </button>
                </div>
              </div>
            </div>

            {/* Task Body */}
            <div className="bg-white rounded-lg shadow-sm p-3">
              <TaskItems task={task} />
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Tasks;
