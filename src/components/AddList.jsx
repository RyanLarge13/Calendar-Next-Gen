import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import { AiFillCloseCircle } from "react-icons/ai";
import { colors } from "../constants.js";

const AddList = () => {
  const [addItems, setAddItems] = useState(false);
  const [listItems, setListItems] = useState([]);
  const [itemTitle, setItemTitle] = useState("");
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("");

  const createList = () => {
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

  const addListToDB = () => {};

  const removeItem = (item) => {
    const newList = listItems.filter((prevItem) => prevItem !== item);
    setListItems(newList);
  };

  return (
    <div className="mt-20 text-center">
      {!addItems ? (
        <div>
          <h2>Create a new list!!</h2>
          <p>What is the name of your list?</p>
          <input
            type="text"
            value={title}
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
          />
          <p>Pick a color</p>
          <div className="flex flex-wrap gap-2 items-center justify-center px-5">
            {colors.map((item) => (
              <div
                key={item.color}
                onClick={() => setColor(item.color)}
                className={`${item.color} w-[20px] h-[20px] rounded-full shadow-sm`}
              ></div>
            ))}
          </div>
          <button
            onClick={() => createList()}
            className="rounded-md shadow-md py-2 w-full bg-gradient-to-tr from-lime-300 to-emerald-200"
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
            className="my-5 py-1 w-full rounded-md shadow-md bg-gradient-to-tr from-lime-300 to-green-200"
          >
            Add
          </button>
          <div className="text-left">
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
          <div className="flex flex-col">
            <button
              onClick={() => setAddItems(false)}
              className="mb-1 mt-5 py-1 w-full rounded-md shadow-md bg-gradient-to-tr from-rose-300 to-amber-200"
            >
              Go Back
            </button>
            <button
              onClick={() => addListToDB()}
              className="my-1 py-1 w-full rounded-md shadow-md bg-gradient-to-tr from-lime-300 to-green-200"
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
