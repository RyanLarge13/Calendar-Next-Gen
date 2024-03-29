import { useState, useContext } from "react";
import { createNewList } from "../utils/api.js";
import { v4 as uuidv4 } from "uuid";
import UserContext from "../context/UserContext.jsx";
import InteractiveContext from "../context/InteractiveContext.jsx";
import DatesContext from "../context/DatesContext.jsx";
import { AiFillCloseCircle } from "react-icons/ai";
import Color from "./Color";
import { colors } from "../constants.js";

const AddList = ({ eventsForDay }) => {
 const { user, setLists, setSystemNotif, preferences } =
  useContext(UserContext);
 const { setMenu, setType, setAddNewEvent } = useContext(InteractiveContext);
 const { setOpenModal } = useContext(DatesContext);
 const [addItems, setAddItems] = useState(false);
 const [listItems, setListItems] = useState([]);
 const [itemTitle, setItemTitle] = useState("");
 const [eventForList, setEventForList] = useState(null);
 const [title, setTitle] = useState("");
 const [color, setColor] = useState("");
 let increment = 0;

 const createList = () => {
  if (!title) {
   const newError = {
    show: true,
    title: "Add Title",
    text: "You must add a title to your list",
    color: "bg-red-200",
    hasCancel: false,
    actions: [
     {
      text: "close",
      func: () => setSystemNotif({ show: false })
     }
    ]
   };
   return setSystemNotif(newError);
  }
  if (!color) {
   const newError = {
    show: true,
    title: "Add Color",
    text: "You must add a color to your list",
    color: "bg-red-200",
    hasCancel: false,
    actions: [
     {
      text: "close",
      func: () => setSystemNotif({ show: false })
     }
    ]
   };
   return setSystemNotif(newError);
  }
  setAddItems(true);
 };

 const addItemsToList = () => {
  if (!itemTitle) {
   const newNotif = {
    show: true,
    title: "No Items",
    text: "Please add items",
    color: "bg-red-200",
    hasCancel: false,
    actions: [
     {
      text: "close",
      func: () => setSystemNotif({ show: false })
     }
    ]
   };
   return setSystemNotif(newNotif);
  }
  const newOrderIndex = listItems.length;
  if (itemTitle.includes(",")) {
   const eachItem = itemTitle.split(",");
   eachItem.forEach((item, index) => {
    setListItems(prev => [
     ...prev,
     {
      id: uuidv4(),
      text: item.trim(),
      orderIndex: newOrderIndex + index + increment,
      complete: false
     }
    ]);
    increment += eachItem.length;
   });
  }
  if (!itemTitle.includes(",")) {
   setListItems(prev => [
    ...prev,
    {
     id: uuidv4(),
     text: itemTitle.trim(),
     orderIndex: newOrderIndex + increment,
     complete: false
    }
   ]);
   increment++;
  }
  setItemTitle("");
 };

 const addListToDB = () => {
  const newList = {
   title,
   items: listItems,
   color,
   userId: user.id,
   eventId: eventForList ? eventForList.id : null
  };
  const token = localStorage.getItem("authToken");
  if (!token) return;
  createNewList(token, user.username, newList)
   .then(res => {
    const addedList = res.data.list;
    setType(null);
    setLists(prev => [addedList, ...prev]);
    setOpenModal(false);
    setAddNewEvent(false);
    setMenu(true);
   })
   .catch(err => {
    console.log(err);
   });
 };

 const removeItem = item => {
  const newList = listItems.filter(prevItem => prevItem !== item);
  setListItems(newList);
 };

 return (
  <div>
   {!addItems ? (
    <div>
     <input
      type="text"
      value={title}
      placeholder="List"
      onChange={e => setTitle(e.target.value)}
      className={`w-full p-2 text-4xl my-5 bg-opacity-80 focus:outline-none ${
       preferences.darkMode ? "bg-[#222] text-white" : "bg-white text-black"
      }`}
     />
     <div className="flex flex-wrap items-center justify-center my-5">
      {colors.map((item, index) => (
       <Color
        key={index}
        string={item.color}
        color={color}
        setColor={setColor}
        index={index}
       />
      ))}
     </div>
     <div>
      {eventsForDay.map(event => (
       <button
        key={event.id}
        onClick={() =>
         setEventForList(prev => (prev?.id === event.id ? null : event))
        }
        className={`${
         eventForList?.id === event.id
          ? preferences.darkMode
            ? "bg-slate-700"
            : "bg-slate-200"
          : preferences.darkMode
          ? "bg-[#222] "
          : "bg-white"
        } duration-300 p-3 rounded-md
                            shadow-lg my-1 relative pl-5 w-full text-left`}
       >
        <div
         className={`${event.color} absolute left-0 top-0
                            bottom-0 w-2 rounded-md`}
        ></div>
        {event.summary}
       </button>
      ))}
     </div>
     <div className="absolute bottom-4 right-4 left-4 text-black">
      <button
       onClick={() => createList()}
       className="rounded-md shadow-md py-2 w-full bg-gradient-to-tr from-lime-300 to-emerald-200 text-xs underline"
      >
       create
      </button>
      <button
       onClick={() => {
        setType(null);
        setAddNewEvent(false);
       }}
       className="px-3 w-full text-xs mt-3 py-2 rounded-md shadow-md bg-gradient-to-tr from-red-200 to-rose-200 underline"
      >
       cancel
      </button>
     </div>
    </div>
   ) : (
    <div className="pt-5">
     <p className="text-4xl p-2">{title}</p>
     <input
      type="text"
      value={itemTitle}
      placeholder="Add new items!!"
      onChange={e => setItemTitle(e.target.value)}
      className={`mt-5 text-lg px-3 py-1 w-full focus:outline-none focus:shadow-sm ${
       preferences.darkMode ? "bg-[#222] text-white" : "bg-white text-black"
      }`}
     />
     <button
      onClick={() => addItemsToList()}
      type="text"
      className="my-5 py-2 w-full rounded-md shadow-md bg-gradient-to-tr from-lime-300 to-green-200 text-xs underline text-black"
     >
      Add
     </button>
     <div className="text-left mb-40">
      {listItems.length > 0 &&
       listItems.map(item => (
        <div
         key={item.id}
         className="p-3 border-b border-b-slate-300 flex justify-between items-center"
        >
         <p>{item.text}</p>
         <AiFillCloseCircle onClick={() => removeItem(item)} />
        </div>
       ))}
     </div>
     <div className="flex flex-col fixed bottom-5 w-[60%] lg:w-[39%] text-black">
      <button
       onClick={() => setAddItems(false)}
       className="mb-1 mt-5 py-2 w-full rounded-md shadow-md bg-gradient-to-tr from-rose-300 to-amber-200 text-xs underline"
      >
       Go Back
      </button>
      <button
       onClick={() => addListToDB()}
       className="my-1 py-2 w-full rounded-md shadow-md bg-gradient-to-tr from-lime-300 to-green-200 text-xs underline"
      >
       Complete List
      </button>
     </div>
    </div>
   )}
  </div>
 );
};

export default AddList;
