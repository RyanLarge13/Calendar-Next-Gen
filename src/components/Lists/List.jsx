import React, { useContext, useState } from "react";
import { deleteList, updateListTitle } from "../../utils/api";
import UserContext from "../../context/UserContext";
import { getAuthToken } from "../../utils/helpers";
import { RiFileCopy2Line } from "react-icons/ri";
import { BiListMinus, BiListPlus } from "react-icons/bi";
import { BsFillShareFill, BsFillTrashFill } from "react-icons/bs";
import ListItems from "./ListItems";
import Portal from "../Misc/Portal";

const List = ({ list }) => {
  const { setLists, preferences, setSystemNotif } = useContext(UserContext);

  const [title, setTitle] = useState(list.title);
  const [titleUpdate, setTitleUpdate] = useState(list.title);
  const [addItems, setAddItems] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const updateTitleOnList = async (e) => {
    e.preventDefault();
    if (!title) return;
    if (title === titleUpdate) return;

    setLists((prev) =>
      prev.map((l) => (l.id === list.id ? { ...l, title } : l)),
    );

    try {
      const token = getAuthToken();
      await updateListTitle(list.id, title, token);
      setTitleUpdate(title);
    } catch (err) {
      console.log(`Error from server updating list title. Error: ${err}`);
    }
  };

  const copyAsPlainText = async () => {
    let listString = "";
    for (let i = 0; i < list.items.length; i++) {
      listString += `${i + 1}. ${list.items[i].text.trim()}\n\n`;
    }
    await navigator.clipboard.writeText(listString);
  };

  const deleteEntireList = async (listId) => {
    setSystemNotif({ show: false });
    const token = getAuthToken();
    if (!token) return;
    try {
      await deleteList(token, listId);
      setLists((prev) => prev.filter((item) => item.id !== listId));
    } catch (err) {
      console.log("Error deleting entire list");
      console.log(err);
    }
  };

  const confirmDeleteEntireList = () => {
    const newNotif = {
      show: true,
      title: "Delete List",
      text: `Are you sure you want to delete this list ${list.title}?`,
      color: "bg-red-300",
      hasCancel: true,
      actions: [
        {
          text: "cancel",
          func: () => setSystemNotif({ show: false }),
        },
        {
          text: "delete",
          func: () => deleteEntireList(list.id),
        },
      ],
    };
    setSystemNotif(newNotif);
  };

  const listBody = (expanded) => <ListItems addItems={addItems} listId={list.id} items={list.items} expanded={expanded} />;

  return (
    <div
      className={`
        relative list-none overflow-hidden
        rounded-3xl border shadow-sm transition-all
        ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/7" : "bg-white border-black/10 hover:bg-black/[0.02]"}
        my-4 ml-0 mr-6 md:mr-4
      `}
    >
      {/* Accent strip */}
      <div className={`${list.color} absolute left-0 top-0 bottom-0 w-2`} />

      {/* Header */}
      <div
        className={`
          px-4 py-3 pl-6
          border-b
          ${preferences.darkMode ? "border-white/10" : "border-black/10"}
        `}
      >
        <form onSubmit={updateTitleOnList} className="w-full min-w-0 my-2">
          <input
            className={`
              w-full bg-transparent outline-none font-semibold text-sm
              ${preferences.darkMode ? "text-white placeholder:text-white/40" : "text-slate-900 placeholder:text-slate-500"}
            `}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add your title..."
            onBlur={updateTitleOnList}
            type="text"
          />
        </form>
        <div className="flex items-start justify-between gap-3">
          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyAsPlainText}
              className={`
                grid place-items-center h-9 w-9 rounded-2xl border shadow-sm transition active:scale-95
                ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70" : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"}
              `}
              aria-label="Copy list"
            >
              <RiFileCopy2Line />
            </button>

            {!addItems ? (
              <button
                type="button"
                onClick={() => setAddItems(true)}
                className={`
                  grid place-items-center h-9 w-9 rounded-2xl border shadow-sm transition active:scale-95
                  ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70 hover:text-emerald-200" : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600 hover:text-emerald-600"}
                `}
                aria-label="Add items"
              >
                <BiListPlus className="text-lg" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAddItems(false)}
                className={`
                  grid place-items-center h-9 w-9 rounded-2xl border shadow-sm transition active:scale-95
                  ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70 hover:text-amber-200" : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600 hover:text-amber-600"}
                `}
                aria-label="Close add items"
              >
                <BiListMinus className="text-lg" />
              </button>
            )}

            <button
              type="button"
              className={`
                grid place-items-center h-9 w-9 rounded-2xl border shadow-sm transition active:scale-95
                ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70" : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"}
              `}
              aria-label="Share"
            >
              <BsFillShareFill />
            </button>

            <button
              type="button"
              onClick={confirmDeleteEntireList}
              className={`
                grid place-items-center h-9 w-9 rounded-2xl border shadow-sm transition active:scale-95
                ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/60 hover:text-rose-300" : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-500 hover:text-rose-500"}
              `}
              aria-label="Delete"
            >
              <BsFillTrashFill />
            </button>
          </div>
        </div>
      </div>

      <button type="button" className="calendar-action mx-5 mt-3 px-4 py-2 text-sm" onClick={() => setFullscreen(true)}>Open full screen</button>
      {/* Body */}
      <div className="p-2">
        {listBody(false)}
      </div>
      {fullscreen && <Portal><div className="fixed inset-0 z-[1200] bg-black/65 p-2 sm:p-6" role="dialog" aria-modal="true" aria-label={list.title}>
        <div className={`${preferences.darkMode ? "bg-[#222] text-white" : "calendar-surface"} mx-auto h-full max-w-4xl rounded-3xl border shadow-xl flex flex-col overflow-hidden`}>
          <div className="flex items-center justify-between border-b p-4"><h2 className="font-semibold text-xl">{list.title}</h2><button className="calendar-action px-4 py-2" onClick={() => setFullscreen(false)}>Close</button></div>
          <div className="overflow-y-auto flex-1 p-4 pr-8 sm:pr-12 touch-pan-y">{listBody(true)}</div>
        </div>
      </div></Portal>}
    </div>
  );
};

export default List;
