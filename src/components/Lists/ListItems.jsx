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

const ListItems = ({ addItems, listId, items }) => {
  const { listUpdate, setListUpdate } = useContext(InteractiveContext);
  const { setSystemNotif, preferences } = useContext(UserContext);
  const [indexes, setIndexes] = useState(items);
  const [newItemText, setNewItemText] = useState("");
  const [sortOrder, setSortOrder] = useState(1);

  useEffect(() => {
    const itemsCopy = [...items];
    if (sortOrder === 1) {
      const newSort = itemsCopy.sort((a, b) => a.orderIndex - b.orderIndex);
      setIndexes(newSort);
    }
    if (sortOrder === 2) {
      const newSort = itemsCopy.sort((a, b) =>
        a.text.toLowerCase() > b.text.toLowerCase() ? 1 : -1,
      );
      setIndexes(newSort);
    }
    if (sortOrder === 3) {
      const newSort = itemsCopy.sort((a, b) =>
        b.text.toLowerCase() > a.text.toLowerCase() ? 1 : -1,
      );
      setIndexes(newSort);
    }
    if (sortOrder === 4) {
      const newSort = itemsCopy
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .reverse();
      setIndexes(newSort);
    }
  }, [sortOrder]);

  const removeItem = (item) => {
    const newList = indexes.filter((i) => i.id !== item.id);
    setIndexes(newList);
    const contains = listUpdate.find((li) => li.listId === listId);
    if (contains) {
      listUpdate[listUpdate.indexOf(contains)].listItems = newList;
    }
    if (!contains) {
      const newObj = {
        listId: listId,
        listItems: newList,
      };
      setListUpdate((prev) => [...prev, newObj]);
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
      return setSystemNotif(newNotif);
    }
    if (newItemText) {
      const newItem = {
        id: uuidv4(),
        text: newItemText,
        orderIndex: items.length + 1,
        complete: false,
      };
      const newList = [...indexes, newItem];
      setIndexes(newList);
      const contains = listUpdate.find((li) => li.listId === listId);
      if (contains) {
        listUpdate[listUpdate.indexOf(contains)].listItems = newList;
      }
      if (!contains) {
        const newObj = {
          listId: listId,
          listItems: [...items, newItem],
        };
        setListUpdate((prev) => [...prev, newObj]);
      }
    }
    setNewItemText("");
  };

  const updateOrderIndexes = (newIndexes) => {
    setIndexes(newIndexes);
    // Update the orderIndex values of the items based on the new indexes
    const updatedItems = newIndexes.map((item, newIndex) => ({
      ...item,
      orderIndex: newIndex + 1,
    }));
    // Check if the listId exists in the listUpdate array
    const containsListId = listUpdate.some((list) => list.listId === listId);
    // Update the listUpdate context with the new reordered list
    const updatedListUpdate = containsListId
      ? listUpdate.map((list) =>
          list.listId === listId ? { ...list, listItems: updatedItems } : list,
        )
      : [...listUpdate, { listId, listItems: updatedItems }];
    setListUpdate(updatedListUpdate);
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
          onClick={() => setSortOrder(2)}
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
          onClick={() => setSortOrder(3)}
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
          onClick={() => setSortOrder(1)}
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
          onClick={() => setSortOrder(4)}
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
