import { useState } from "react";
import { AiFillCloseCircle, AiFillPlusCircle } from "react-icons/ai";
import {
 FaSortAlphaDownAlt,
 FaSortAlphaUp,
 FaSortAmountDown,
 FaSortAmountUp
} from "react-icons/fa";

const TaskItems = ({ items }) => {
 const [itemsCopy, setItemsCopy] = useState(items);
 const [newTaskText, setNewTaskText] = useState("");
 const [taskUpdates, setTaskUpdates] = useState([])

 const addNewTaskItem = () => {};

 const handleChecked = (e, myTask) => {
  const newCheck = e.target.checked;
  const newItems = itemsCopy.map(itm => {
   if (itm.id === myTask.id) {
    return { ...itm, complete: newCheck };
   }
   return itm;
  });
  setItemsCopy(newItems);
 };

 const removeTaskItem = myTask => {
  const newTasks = itemsCopy.filter(itm => itm.id !== myTask.id);
  setItemsCopy(newTasks);
 };

 return (
  <div>
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
     onSubmit={e => {
      e.preventDefault();
      addNewItem();
     }}
     className="w-full mr-3"
    >
     <input
      type="text"
      className="rounded-md shadow-md px-3 py-2 outline-none w-full"
      placeholder="New Item"
      value={newTaskText}
      onChange={e => setNewTaskText(e.target.value)}
      autoFocus={true}
     />
    </form>
    <AiFillPlusCircle
     onClick={() => addNewTaskItem()}
     className="text-lg cursor-pointer"
    />
   </div>
   {itemsCopy.map(taskItem => (
    <div
     key={taskItem.id}
     className="p-3 py-4 border-b border-b-slate-300 bg-white rounded-sm"
    >
     <label htmlFor={taskItem} className="flex">
      <input
       onChange={e => handleChecked(e, taskItem)}
       type="checkbox"
       value={taskItem.text}
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
