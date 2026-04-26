import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { AiFillCloseCircle, AiFillPlusCircle } from "react-icons/ai";
import { Reorder } from "framer-motion";
import {
  FaSortAlphaDownAlt,
  FaSortAlphaUp,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import InteractiveContext from "../../context/InteractiveContext.jsx";
import UserContext from "../../context/UserContext.jsx";
import { getAuthToken } from "../../utils/helpers.js";
import { API_UpdateListItems } from "../../utils/api.js";

const ListItems = ({ listId, items }) => {
  const { setSystemNotif, preferences, setLists } = useContext(UserContext);
  const [newItemText, setNewItemText] = useState("");

  const removeItem = async (itemId) => {
    const newItems = items.filter((i) => i.id !== itemId);

    setLists((prev) =>
      prev.map((l) => {
        if (l.id === listId) {
          return { ...l, items: newItems };
        }
        return l;
      }),
    );

    try {
      const token = getAuthToken();

      await API_UpdateListItems(listId, newItems, token);
    } catch (err) {
      console.log("Error updating list texts");
      console.log(err);
    }
  };

  const addNewItem = () => {
    if (!newItemText) {
      const newNotif = {
        show: true,
        title: "No Item",
        text: "Please type in the list item you'd like to create",
        color: "bg-red-200",
        hasCancel: false,
        actions: [
          { text: "close", func: () => setSystemNotif({ show: false }) },
        ],
      };
      setSystemNotif(newNotif);
      return;
    }
    const newItem = {
      id: uuidv4(),
      text: newItemText,
      orderIndex: items.length + 1,
      complete: false,
    };

    const newItems = [...items, newItem];
    
    setNewItemText("");

    setLists((prev) =>
      prev.map((l) => {
        if (l.id === listId) {
          return { ...l, items: newItems };
        }
        return l;
      }),
    );

    try {
      const token = getAuthToken();
      await API_UpdateListItems(listId, newItems, token);
    } catch (err) {
      console.log("Error adding new list item to list")
      console.log(err);
    }
  };

  return (
    <div className="space-y-3">
      {/* Sort / Filter toolbar */}
      <div
        className={`
      rounded-3xl border shadow-sm p-3
      flex items-center gap-2 ml-3 flex-wrap
      ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-white border-black/10"}
    `}
      >
        <p
          className={`text-[11px] font-semibold tracking-wide mr-1 ${
            preferences.darkMode ? "text-white/55" : "text-slate-500"
          }`}
        >
          Sort
        </p>

        <button
          className={`
        h-10 w-10 grid place-items-center rounded-2xl border shadow-sm transition
        hover:shadow-md active:scale-[0.97]
        ${
          preferences.darkMode
            ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
            : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"
        }
      `}
          aria-label="Sort A to Z"
          title="A → Z"
        >
          <FaSortAlphaUp />
        </button>

        <button
          className={`
        h-10 w-10 grid place-items-center rounded-2xl border shadow-sm transition
        hover:shadow-md active:scale-[0.97]
        ${
          preferences.darkMode
            ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
            : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"
        }
      `}
          aria-label="Sort Z to A"
          title="Z → A"
        >
          <FaSortAlphaDownAlt />
        </button>

        <div
          className={`h-6 w-px ${preferences.darkMode ? "bg-white/10" : "bg-black/10"}`}
        />

        <button
          className={`
        h-10 w-10 grid place-items-center rounded-2xl border shadow-sm transition
        hover:shadow-md active:scale-[0.97]
        ${
          preferences.darkMode
            ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
            : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"
        }
      `}
          aria-label="Sort by largest first"
          title="Largest first"
        >
          <FaSortAmountDown />
        </button>

        <button
          className={`
        h-10 w-10 grid place-items-center rounded-2xl border shadow-sm transition
        hover:shadow-md active:scale-[0.97]
        ${
          preferences.darkMode
            ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
            : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"
        }
      `}
          aria-label="Sort by smallest first"
          title="Smallest first"
        >
          <FaSortAmountUp />
        </button>

        {/* Optional: space for future filter chips */}
        <div className="flex-1" />
      </div>

      {/* Add item row */}
      {addItems.includes(listId) && (
        <div
          className={`
        rounded-3xl border shadow-sm p-3
        flex items-center gap-3
        ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-white border-black/10"}
      `}
        >
          <form
            className="flex-1 min-w-0"
            onSubmit={(e) => {
              e.preventDefault();
              addNewItem();
            }}
          >
            <input
              type="text"
              className={`
            w-full px-4 py-3 rounded-2xl border shadow-inner outline-none text-sm font-semibold
            transition
            ${
              preferences.darkMode
                ? "bg-[#161616]/40 border-white/10 text-white placeholder:text-white/40 focus:bg-[#161616]/55"
                : "bg-black/[0.03] border-black/10 text-slate-900 placeholder:text-slate-400 focus:bg-black/[0.05]"
            }
          `}
              placeholder="New item…"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              autoFocus
            />
          </form>

          <button
            type="button"
            onClick={() => addNewItem()}
            className={`
          h-12 w-12 grid place-items-center rounded-2xl border shadow-sm transition
          hover:shadow-md active:scale-[0.97]
          ${
            preferences.darkMode
              ? "bg-cyan-500/15 border-cyan-300/20 text-cyan-100 hover:bg-cyan-500/20"
              : "bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100"
          }
        `}
            aria-label="Add item"
          >
            <AiFillPlusCircle className="text-2xl" />
          </button>
        </div>
      )}

      {/* List */}
      <Reorder.Group
        axis="y"
        values={indexes}
        onReorder={updateOrderIndexes}
        className={`
      max-h-[700px] pt-3 overflow-y-auto scrollbar-hide pr-1
      space-y-2
    `}
      >
        {indexes?.map((listItem, index) => (
          <Reorder.Item
            key={listItem.id}
            value={listItem}
            whileDrag={{
              scale: 1.02,
              cursor: "grabbing",
            }}
            className={`
          relative cursor-grab select-none
          rounded-3xl border shadow-sm
          px-4 py-4
          flex items-center justify-between gap-3
          transition
          ${
            preferences.darkMode
              ? "bg-white/5 border-white/10 hover:bg-white/7"
              : "bg-white border-black/10 hover:bg-black/[0.02]"
          }
        `}
          >
            {/* Index badge */}
            <div
              className={`
            absolute -top-2 -left-2
            h-7 min-w-[28px] px-2
            grid place-items-center
            rounded-2xl border shadow-md text-[11px] font-bold
            ${
              preferences.darkMode
                ? "bg-white/10 border-white/15 text-white/80"
                : "bg-white border-black/10 text-slate-700"
            }
          `}
            >
              {index + 1}
            </div>

            {/* Text */}
            <div className="min-w-0">
              <p
                className={`text-sm font-semibold break-words ${preferences.darkMode ? "text-white/85" : "text-slate-900"}`}
              >
                {listItem.text}
              </p>
            </div>

            {/* Remove */}
            <button
              type="button"
              onClick={() => removeItem(listItem)}
              className={`
            flex-shrink-0 h-10 w-10 grid place-items-center rounded-2xl border shadow-sm transition
            hover:shadow-md active:scale-[0.97]
            ${
              preferences.darkMode
                ? "bg-white/5 border-white/10 text-white/60 hover:text-rose-200 hover:bg-white/10"
                : "bg-black/[0.03] border-black/10 text-slate-500 hover:text-rose-600 hover:bg-black/[0.06]"
            }
          `}
              aria-label="Remove item"
            >
              <AiFillCloseCircle className="text-xl" />
            </button>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};

export default ListItems;
