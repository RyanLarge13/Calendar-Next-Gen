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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {tasksToRender.length < 1 ? (
        <div>
          <div className="rounded-md p-3 shadow-md my-5 flex justify-between items-center">
            <div>
              <h2 className="font-semibold mb-2">No Tasks to Show</h2>
              <BsListTask />
            </div>
            <div className="text-2xl p-2" onClick={() => openModalAndSetType()}>
              <IoIosAddCircle />
            </div>
          </div>
        </div>
      ) : (
        tasksToRender.map((task) => (
          <div
            key={task.id}
            className={`p-3 my-5 md:mx-3 lg:mx-5 rounded-md shadow-md ${task.color} text-black`}
          >
            <div className="rounded-md shadow-md bg-white p-2 mb-2">
              <div className="flex justify-between items-center">
                <p>
                  {new Date(task.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <div className="mb-3 flex justify-center items-center gap-x-3">
                  <button onClick={() => editTitle(task)}>
                    <BsPenFill />
                  </button>
                  <BsShareFill />
                  <button onClick={() => confirmDeleteTask(task.id)}>
                    <BsTrashFill />
                  </button>
                </div>
              </div>
            </div>
            <TaskItems task={task} />
          </div>
        ))
      )}
    </div>
  );
};

export default Tasks;
