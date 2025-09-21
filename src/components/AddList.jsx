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
            func: () => setSystemNotif({ show: false }),
          },
        ],
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
            func: () => setSystemNotif({ show: false }),
          },
        ],
      };
      return setSystemNotif(newError);
    }
    setAddItems(true);
  };

  const addItemsToList = (e) => {
    e.preventDefault();
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
            func: () => setSystemNotif({ show: false }),
          },
        ],
      };
      return setSystemNotif(newNotif);
    }
    const newOrderIndex = listItems.length;
    if (itemTitle.includes(",")) {
      const eachItem = itemTitle.split(",");
      eachItem.forEach((item, index) => {
        setListItems((prev) => [
          ...prev,
          {
            id: uuidv4(),
            text: item.trim(),
            orderIndex: newOrderIndex + index + increment,
            complete: false,
          },
        ]);
        increment += eachItem.length;
      });
    }
    if (!itemTitle.includes(",")) {
      setListItems((prev) => [
        ...prev,
        {
          id: uuidv4(),
          text: itemTitle.trim(),
          orderIndex: newOrderIndex + increment,
          complete: false,
        },
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
      eventId: eventForList ? eventForList.id : null,
    };
    const token = localStorage.getItem("authToken");
    if (!token) return;
    createNewList(token, user.username, newList)
      .then((res) => {
        const addedList = res.data.list;
        setType(null);
        setLists((prev) => [addedList, ...prev]);
        setOpenModal(false);
        setAddNewEvent(false);
        setMenu(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const removeItem = (item) => {
    const newList = listItems.filter((prevItem) => prevItem !== item);
    setListItems(newList);
  };

  return (
    <div>
      {!addItems ? (
        <div className="md:px-10 md:pt-20">
          <input
            type="text"
            value={title}
            placeholder="List Title ..."
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full p-2 text-4xl my-5 bg-opacity-80 focus:outline-none ${
              preferences.darkMode
                ? "bg-[#222] text-white"
                : "bg-white text-black"
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
            {eventsForDay.map((event) => (
              <button
                key={event.id}
                onClick={() =>
                  setEventForList((prev) =>
                    prev?.id === event.id ? null : event
                  )
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
          <div className="absolute bottom-4 right-4 left-4 text-black space-y-3">
            <button
              onClick={() => createList()}
              className="w-full rounded-xl py-2.5 text-sm font-semibold shadow-md 
               bg-gradient-to-tr from-lime-300 to-emerald-200 
               hover:from-lime-400 hover:to-emerald-300 
               active:scale-[0.97] transition-all duration-200"
            >
              Create
            </button>

            <button
              onClick={() => {
                setType(null);
                setAddNewEvent(false);
              }}
              className="w-full rounded-xl py-2.5 text-sm font-semibold shadow-md 
               bg-gradient-to-tr from-red-200 to-rose-200 
               hover:from-red-300 hover:to-rose-300 
               active:scale-[0.97] transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="h-screen flex flex-col justify-between pt-20 pb-3 px-3">
          <div>
            <p className="text-4xl p-2">{title}</p>
            <form onSubmit={(e) => addItemsToList(e)}>
              <input
                type="text"
                value={itemTitle}
                placeholder="Add new items!!"
                onChange={(e) => setItemTitle(e.target.value)}
                className={`mt-5 text-lg px-3 py-1 w-full focus:outline-none focus:shadow-sm ${
                  preferences.darkMode
                    ? "bg-[#222] text-white"
                    : "bg-white text-black"
                }`}
              />
              <button
                onClick={(e) => addItemsToList(e)}
                type="submit"
                className="w-full rounded-xl py-2.5 text-black text-sm font-semibold shadow-md 
            bg-gradient-to-tr from-lime-300 to-emerald-200 
            hover:from-lime-400 hover:to-emerald-300 
            active:scale-[0.97] transition-all duration-200 mt-3"
              >
                Add
              </button>
            </form>
            <div className="text-left my-10">
              {listItems.length > 0 &&
                listItems.map((item) => (
                  <div
                    key={item.id}
                    className={`group flex items-center justify-between px-4 py-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 my-1 ${color}`}
                  >
                    <p className="text-sm font-medium">{item.text}</p>

                    <AiFillCloseCircle
                      onClick={() => removeItem(item)}
                      className="text-gray-400 hover:text-red-500 duration-200 transition-colors cursor-pointer text-lg"
                    />
                  </div>
                ))}
            </div>
          </div>
          <div className="flex flex-col text-black gap-y-2">
            <button
              onClick={() => addListToDB()}
              className="rounded-xl py-2.5 text-black text-sm font-semibold shadow-md 
              bg-gradient-to-tr from-lime-300 to-emerald-200 
              hover:from-lime-400 hover:to-emerald-300 
              active:scale-[0.97] transition-all duration-200"
            >
              Complete List
            </button>
            <button
              onClick={() => setAddItems(false)}
              className="rounded-xl py-2.5 text-sm font-semibold shadow-md 
              bg-gradient-to-tr from-red-200 to-rose-200 
               hover:from-red-300 hover:to-rose-300 
               active:scale-[0.97] transition-all duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddList;
