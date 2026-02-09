import { useContext, useRef, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { BsCheck, BsList } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { colors } from "../../constants/miscConstants.js";
import DatesContext from "../../context/DatesContext.jsx";
import InteractiveContext from "../../context/InteractiveContext.jsx";
import UserContext from "../../context/UserContext.jsx";
import { createNewList } from "../../utils/api.js";
import Color from "../Misc/Color";

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

  const listItemInput = useRef(null);

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

    // Refocus input
    if (listItemInput.current) {
      listItemInput.current.focus();
    }
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
    <div className="h-screen border border-black pt-20 px-3">
      {!addItems ? (
        <div className="h-full flex flex-col justify-between">
          <div className="relative md:px-10 md:pt-16">
            {/* Title */}
            <input
              type="text"
              value={title}
              placeholder="List Title..."
              onChange={(e) => setTitle(e.target.value)}
              className={`
          w-full mt-2 h-20 mb-6 bg-transparent text-3xl sm:text-4xl font-semibold tracking-tight
          outline-none placeholder:opacity-60
          ${preferences.darkMode ? "text-white placeholder:text-gray-300" : "text-slate-900 placeholder:text-slate-500"}
        `}
            />

            {/* Color picker */}
            <div className="flex flex-wrap items-center justify-center gap-1 py-2 mb-4">
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

            {/* Pick an event */}
            <div
              className={`
          rounded-2xl border shadow-sm p-3 sm:p-4 space-y-2
          ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-white border-black/10"}
        `}
            >
              {eventsForDay.length > 0 ? (
                <p
                  className={`text-sm font-semibold mb-2 ${preferences.darkMode ? "text-white/70" : "text-slate-600"}`}
                >
                  Link this list to an event (optional)
                </p>
              ) : null}

              {eventsForDay.map((event) => (
                <button
                  key={event.id}
                  onClick={() =>
                    setEventForList((prev) =>
                      prev?.id === event.id ? null : event,
                    )
                  }
                  className={`
              relative w-full text-left pl-6 pr-4 py-4 rounded-2xl
              border shadow-sm transition-all duration-200
              hover:shadow-md hover:scale-[1.01] active:scale-[0.99]
              ${
                eventForList?.id === event.id
                  ? preferences.darkMode
                    ? "bg-white/10 border-white/20"
                    : "bg-black/[0.03] border-black/20"
                  : preferences.darkMode
                    ? "bg-white/5 border-white/10 hover:bg-white/7"
                    : "bg-white border-black/10 hover:bg-black/[0.02]"
              }
            `}
                >
                  <div
                    className={`${event.color} absolute left-0 top-0 bottom-0 w-2 rounded-l-2xl`}
                  />
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold">
                      {event.summary}
                    </span>

                    {eventForList?.id === event.id && (
                      <span
                        className={`
                    text-[11px] font-semibold px-2 py-1 rounded-xl border
                    ${preferences.darkMode ? "bg-white/10 border-white/15 text-white/80" : "bg-white border-black/10 text-slate-600"}
                  `}
                      >
                        Selected
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom actions */}
          <div className="flex justify-between p-5 items-center w-full">
            <button
              onClick={() => {
                setType(null);
                setAddNewEvent(false);
              }}
              className="grid place-items-center rounded-2xl p-3 shadow-lg transition hover:scale-[0.98] active:scale-95 bg-gradient-to-tr from-red-500 to-rose-500 text-white"
              aria-label="Cancel"
            >
              <MdClose className="text-xl" />
            </button>

            <button
              onClick={() => createList()}
              className="grid place-items-center rounded-2xl p-3 shadow-lg transition hover:scale-[0.98] active:scale-95 bg-gradient-to-tr from-lime-400 to-emerald-500 text-white"
              aria-label="Add Kanban"
            >
              <BsList className="text-xl" />
            </button>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col justify-between">
          <div className="relative md:px-6 md:pt-20">
            <div>
              {/* Title header */}
              <div
                className={`
            rounded-2xl border shadow-sm p-4
            ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-white border-black/10"}
          `}
              >
                <p className="text-3xl sm:text-4xl font-semibold tracking-tight">
                  {title}
                </p>
                <p
                  className={`text-xs mt-1 ${preferences.darkMode ? "text-white/60" : "text-slate-500"}`}
                >
                  Add items to your list
                </p>
              </div>

              {/* Add item form */}
              <form onSubmit={(e) => addItemsToList(e)} className="mt-4">
                <input
                  ref={listItemInput}
                  type="text"
                  value={itemTitle}
                  placeholder="Add a new item..."
                  onChange={(e) => setItemTitle(e.target.value)}
                  className={`
              w-full rounded-2xl border px-4 py-3 text-sm font-medium outline-none transition-all
              ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10 text-white placeholder:text-gray-300 focus:border-emerald-300/30 focus:ring-2 focus:ring-emerald-500/20"
                  : "bg-white border-black/10 text-slate-900 placeholder:text-slate-500 focus:border-emerald-400/40 focus:ring-2 focus:ring-emerald-500/10"
              }
            `}
                />

                <button
                  onClick={(e) => addItemsToList(e)}
                  type="submit"
                  className="
              w-full mt-3 rounded-2xl py-3 text-sm font-semibold text-white
              bg-gradient-to-tr from-lime-400 to-emerald-500
              shadow-md hover:shadow-lg hover:scale-[1.015]
              active:scale-[0.97] transition-all duration-200
            "
                >
                  Add
                </button>
              </form>

              {/* Items */}
              <div className="text-left mt-6">
                {listItems.length > 0 &&
                  listItems.map((item) => (
                    <div
                      key={item.id}
                      className={`
                  group flex items-center justify-between px-4 py-3 rounded-2xl
                  border shadow-sm transition-all duration-200 my-2
                  ${preferences.darkMode ? "border-white/10 bg-white/5 hover:bg-white/7" : "border-black/10 bg-white hover:bg-black/[0.02]"}
                `}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`${color} h-3 w-3 rounded-full ring-1 ring-black/10`}
                        />
                        <p
                          className={`text-sm font-semibold ${preferences.darkMode ? "text-white" : "text-slate-800"}`}
                        >
                          {item.text}
                        </p>
                      </div>

                      <AiFillCloseCircle
                        onClick={() => removeItem(item)}
                        className="text-gray-400 hover:text-rose-500 transition-colors cursor-pointer text-xl"
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
          {/* Bottom actions */}
          <div className="flex justify-between p-5 items-center w-full">
            <button
              onClick={() => setAddItems(false)}
              className="grid place-items-center rounded-2xl p-3 shadow-lg transition hover:scale-[0.98] active:scale-95 bg-gradient-to-tr from-red-500 to-rose-500 text-white"
              aria-label="Cancel"
            >
              <MdClose className="text-xl" />
            </button>

            <button
              onClick={() => addListToDB()}
              className="grid place-items-center rounded-2xl p-3 shadow-lg transition hover:scale-[0.98] active:scale-95 bg-gradient-to-tr from-lime-400 to-emerald-500 text-white"
              aria-label="Add Kanban"
            >
              <BsCheck className="text-xl" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddList;
