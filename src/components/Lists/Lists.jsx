import { Reorder, motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { BiListMinus, BiListPlus } from "react-icons/bi";
import { BsFillShareFill, BsFillTrashFill } from "react-icons/bs";
import { IoIosAddCircle } from "react-icons/io";
import { RiFileCopy2Line } from "react-icons/ri";
import Masonry from "react-masonry-css";
import DatesContext from "../../context/DatesContext";
import InteractiveContext from "../../context/InteractiveContext";
import UserContext from "../../context/UserContext";
import { deleteList, updateListTitle } from "../../utils/api";
import ListItems from "./ListItems";

const Lists = ({ listSort, listSortOpt, listSearch, listSearchTxt }) => {
  const { string, setString, setOpenModal } = useContext(DatesContext);
  const { lists, setLists, setSystemNotif, preferences } =
    useContext(UserContext);
  const { setMenu, setType, setAddNewEvent } = useContext(InteractiveContext);

  const [listsToRender, setListsToRender] = useState(lists);
  const [addItems, setAddItems] = useState([]);

  const breakpointColumnsObj = {
    default: 3, // Number of columns by default
    1800: 3,
    1400: 2, // Number of columns on screens > 1100px
    1000: 1,
  };

  useEffect(() => {
    if (listSort && listSortOpt) {
      switch (listSortOpt) {
        case "title":
          {
            const newLists = [...lists];
            const sortedNewLists = newLists.sort((a, b) =>
              a.title.localeCompare(b.title),
            );
            setListsToRender(sortedNewLists);
          }
          break;
        case "event":
          {
            const newLists = lists.filter((li) => li.eventId !== null);
            setListsToRender(newLists);
          }
          break;
        case "length":
          {
            const newLists = [...lists];
            const newListsSortedLen = newLists.sort(
              (a, b) => a.items.length > a.items.length,
            );
            setListsToRender(newListsSortedLen);
          }
          break;
        default:
          setListsToRender(lists);
          break;
      }
    } else {
      setListsToRender(lists);
    }
  }, [listSort, listSortOpt]);

  useEffect(() => {
    if (listSearch && listSearchTxt) {
      const newLists = lists.filter((li) => li.title.includes(listSearchTxt));
      newLists.sort((a, b) => a.title.localeCompare(b.title));
      setListsToRender(newLists);
    } else {
      setListsToRender(lists);
    }
  }, [listSearch, listSearchTxt]);

  const deleteEntireList = (listId) => {
    setSystemNotif({ show: false });
    const token = localStorage.getItem("authToken");
    if (!token) return;
    const newListOfLists = lists.filter((item) => item.id !== listId);
    setLists(newListOfLists);
    deleteList(token, listId)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const openModalAndSetType = () => {
    if (!string) {
      setString(dateObj.toLocaleDateString());
    }
    setType("todo-list");
    setMenu(false);
    setOpenModal(true);
    setAddNewEvent(true);
  };

  const copyAsPlainText = (items) => {
    let listString = "";
    for (let i = 0; i < items.length; i++) {
      listString += `${i + 1}. ${items[i].text.trim()}\n\n`;
    }
    navigator.clipboard
      .writeText(listString)
      .then(() => {
        console.log("clipped");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <motion.div className="py-4 px-3 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {listsToRender.length < 1 && (
          <div className="min-h-[55vh] grid place-items-center">
            <div
              className={`
            w-full max-w-md rounded-3xl border shadow-2xl backdrop-blur-md p-5 sm:p-6
            ${preferences.darkMode ? "bg-[#161616]/90 border-white/10 text-white" : "bg-white/90 border-black/10 text-slate-900"}
          `}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`
                  grid place-items-center h-12 w-12 rounded-2xl border shadow-sm
                  ${preferences.darkMode ? "bg-emerald-500/15 border-emerald-300/20 text-emerald-100" : "bg-emerald-50 border-emerald-200 text-emerald-700"}
                `}
                  >
                    <BiListPlus className="text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">
                      No lists to show
                    </h2>
                    <p
                      className={`text-sm mt-1 ${preferences.darkMode ? "text-white/60" : "text-slate-500"}`}
                    >
                      Create one and start organizing.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => openModalAndSetType()}
                  className={`
                grid place-items-center h-11 w-11 rounded-2xl border shadow-md transition
                hover:scale-[1.02] active:scale-[0.97]
                ${preferences.darkMode ? "bg-white/10 border-white/10 hover:bg-white/15 text-white" : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-700"}
              `}
                  aria-label="Add list"
                >
                  <IoIosAddCircle className="text-2xl" />
                </button>
              </div>
            </div>
          </div>
        )}

        <Reorder.Group values={listsToRender} onReorder={setListsToRender}>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {listsToRender.map((list) => {
              const [title, setTitle] = useState(list.title);
              const [titleUpdate, setTitleUpdate] = useState(list.title);

              const updateTitleOnList = async (e) => {
                e.preventDefault();
                if (!title) return;
                if (title === titleUpdate) return;

                try {
                  const token = localStorage.getItem("authToken");
                  await updateListTitle(list.id, title, token);
                  setTitleUpdate(title);

                  setLists((prev) =>
                    prev.map((l) => (l.id === list.id ? { ...l, title } : l)),
                  );
                } catch (err) {
                  console.log(
                    `Error from server updating list title. Error: ${err}`,
                  );
                }
              };

              return (
                <Reorder.Item
                  key={list.id}
                  value={list}
                  drag
                  className={`
                relative list-none overflow-hidden
                rounded-3xl border shadow-sm transition-all
                ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/7" : "bg-white border-black/10 hover:bg-black/[0.02]"}
                my-4 mr-6 md:mr-0
              `}
                >
                  {/* Accent strip */}
                  <div
                    className={`${list.color} absolute left-0 top-0 bottom-0 w-2`}
                  />

                  {/* Header */}
                  <div
                    className={`
                  px-4 py-3 pl-6
                  border-b
                  ${preferences.darkMode ? "border-white/10" : "border-black/10"}
                `}
                  >
                    <form
                      onSubmit={updateTitleOnList}
                      className="w-full min-w-0 my-2"
                    >
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
                          onClick={() => copyAsPlainText(list.items)}
                          className={`
                        grid place-items-center h-9 w-9 rounded-2xl border shadow-sm transition active:scale-95
                        ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70" : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"}
                      `}
                          aria-label="Copy list"
                        >
                          <RiFileCopy2Line />
                        </button>

                        {!addItems.includes(list.id) ? (
                          <button
                            type="button"
                            onClick={() =>
                              setAddItems((prev) => [...prev, list.id])
                            }
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
                            onClick={() => {
                              const newIds = addItems.filter(
                                (i) => i !== list.id,
                              );
                              setAddItems(newIds);
                            }}
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
                          onClick={() => {
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
                          }}
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

                  {/* Body */}
                  <div className="p-4 pl-6">
                    <ListItems
                      listColor={list.color}
                      addItems={addItems}
                      listId={list.id}
                      items={list?.items}
                    />
                  </div>
                </Reorder.Item>
              );
            })}
          </Masonry>
        </Reorder.Group>
      </div>
    </motion.div>
  );
};

export default Lists;
