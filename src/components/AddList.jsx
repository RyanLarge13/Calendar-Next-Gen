import { useState, useContext } from "react";
import { createNewList } from "../utils/api.js";
import { MdCancel } from "react-icons/md";
import { BsFillSaveFill } from "react-icons/bs";
import UserContext from "../context/UserContext.jsx";
import InteractiveContext from "../context/InteractiveContext.jsx";
import DatesContext from "../context/DatesContext.jsx";
import { AiFillCloseCircle } from "react-icons/ai";
import Color from "./Color";
import { colors } from "../constants.js";

const AddList = () => {
  const { user, setLists, setSystemNotif } = useContext(UserContext);
  const { setMenu, setType, setAddNewEvent } = useContext(InteractiveContext);
  const { setOpenModal } = useContext(DatesContext);
  const [addItems, setAddItems] = useState(false);
  const [listItems, setListItems] = useState([]);
  const [itemTitle, setItemTitle] = useState("");
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("");

  const createList = () => {
    if (!title) {
      const newError = {
        show: true,
        title: "Add Title",
        text: "You must add a title to your list",
        color: "bg-red-200",
        actions: [
          { text: "close", func: () => setSystemNotif({ show: false }) },
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
        actions: [
          { text: "close", func: () => setSystemNotif({ show: false }) },
        ],
      };
      return setSystemNotif(newError);
    }
    setAddItems(true);
  };

  const addItemsToList = () => {
    if (!itemTitle) return;
    if (itemTitle.includes(",")) {
      const eachItem = itemTitle.split(",");
      eachItem.forEach((item) =>
        setListItems((prev) => [...prev, item.trim()])
      );
    }
    if (!itemTitle.includes(",")) {
      setListItems((prev) => [...prev, itemTitle.trim()]);
    }
    setItemTitle("");
  };

  const addListToDB = () => {
    const newList = {
      title,
      items: listItems,
      color,
      userId: user.id,
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
    <div className="mt-20 text-center">
      {!addItems ? (
        <div>
          <h2 className="text-lg">Create a list</h2>
          <input
            type="text"
            value={title}
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full p-2 rounded-md shadow-md my-5 bg-opacity-80 ${color}`}
          />
          <div className="flex flex-wrap items-center justify-center px-5 my-10">
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
          <button
            onClick={() => createList()}
            className="rounded-md shadow-md py-2 w-[95%] bg-gradient-to-tr from-lime-300 to-emerald-200 absolute bottom-5 left-[2%] text-xs underline"
          >
            Create
          </button>
        </div>
      ) : (
        <div>
          <p className="text-lg mb-3">{title}</p>
          <p className="text-xs text-left">
            Tip: if you want to add multiple items at a time, just seperate each
            item with a comma! <br />
            ex: 'Milk, Eggs, Cereal'
          </p>
          <input
            type="text"
            value={itemTitle}
            placeholder="Add new items!!"
            onChange={(e) => setItemTitle(e.target.value)}
            className="mt-5 rounded-md shadow-md px-3 py-1 w-full"
          />
          <button
            onClick={() => addItemsToList()}
            type="text"
            className="my-5 py-2 w-full rounded-md shadow-md bg-gradient-to-tr from-lime-300 to-green-200 text-xs underline"
          >
            Add
          </button>
          <div className="text-left mb-40">
            {listItems.length > 0 &&
              listItems.map((item, index) => (
                <div
                  key={index}
                  className="p-3 border-b border-b-slate-300 flex justify-between items-center"
                >
                  <p>{item}</p>
                  <AiFillCloseCircle onClick={() => removeItem(item)} />
                </div>
              ))}
          </div>
          <div className="flex flex-col fixed bottom-5 w-[60%]">
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
