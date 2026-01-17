import { useContext, useEffect, useState } from "react";
import ListItems from "./ListItems";
import { deleteList, updateListTitle } from "../utils/api";
import { Reorder, motion, useDragControls } from "framer-motion";
import {
  BsFillTrashFill,
  BsFillPenFill,
  BsFillShareFill,
} from "react-icons/bs";
import { BiListMinus, BiListPlus } from "react-icons/bi";
import { IoIosAddCircle } from "react-icons/io";
import { RiFileCopy2Line } from "react-icons/ri";
import Masonry from "react-masonry-css";
import UserContext from "../context/UserContext";
import InteractiveContext from "../context/InteractiveContext";
import DatesContext from "../context/DatesContext";

const Lists = ({ listSort, listSortOpt, listSearch, listSearchTxt }) => {
  const { string, setString, setOpenModal } = useContext(DatesContext);
  const { lists, setLists, setSystemNotif } = useContext(UserContext);
  const { setMenu, setType, setAddNewEvent } = useContext(InteractiveContext);

  const [listsToRender, setListsToRender] = useState(lists);
  const [addItems, setAddItems] = useState([]);

  const breakpointColumnsObj = {
    default: 5, // Number of columns by default
    1800: 4,
    1400: 3, // Number of columns on screens > 1100px
    1000: 2,
    700: 1, // Number of columns on screens > 700px
  };

  useEffect(() => {
    if (listSort && listSortOpt) {
      switch (listSortOpt) {
        case "title":
          {
            const newLists = [...lists];
            const sortedNewLists = newLists.sort((a, b) =>
              a.title.localeCompare(b.title)
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
              (a, b) => a.items.length > a.items.length
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
    <motion.div className="py-3 relative">
      {listsToRender.length < 1 && (
        <div className="flex h-[50vh] justify-center items-center">
          <div className="w-80 rounded-2xl p-5 shadow-lg my-5 bg-gradient-to-r from-lime-300 via-emerald-300 to-green-300 text-white">
            <div className="flex justify-between items-center">
              <div className="flex flex-col items-start">
                <h2 className="text-lg font-semibold mb-2">
                  No lists to shows
                </h2>
                <BiListPlus className="text-3xl opacity-80" />
              </div>
              <button
                onClick={() => openModalAndSetType()}
                className="text-3xl p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <IoIosAddCircle className="text-white drop-shadow" />
              </button>
            </div>
          </div>
        </div>
      )}
      <Reorder.Group
        values={listsToRender}
        onReorder={setListsToRender}
        // comment out grid styles if using masonry
        // className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-10 list-none"
      >
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

              if (!title) {
                return;
              }

              if (title === titleUpdate) {
                return;
              }

              try {
                const token = localStorage.getItem("authToken");
                await updateListTitle(list.id, title, token);
                setTitleUpdate(title);

                setLists((prev) =>
                  prev.map((l) =>
                    l.id === list.id ? { ...l, title: title } : l
                  )
                );
              } catch (err) {
                console.log(
                  `Error from server updating list title. Error: ${err}`
                );
              }
            };

            return (
              <Reorder.Item
                key={list.id}
                value={list}
                drag
                className={`scrollbar-hide p-3 rounded-md
            shadow-md ${list.color} my-5 mx-0 mr-7 md:mr-0 pr-10 md:pr-3
            text-black list-none`}
              >
                <div className="mb-2 bg-white rounded-md shadow-md p-3 flex justify-between items-center">
                  <form onSubmit={updateTitleOnList} className="w-full mr-2">
                    <input
                      className="font-semibold outline-none focus:outline-none w-full"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Add your title..."
                      onBlur={updateTitleOnList}
                      type="text"
                    />
                  </form>
                  <div className="flex gap-x-3 text-sm">
                    <button onClick={() => copyAsPlainText(list.items)}>
                      {" "}
                      <RiFileCopy2Line />
                    </button>
                    {!addItems.includes(list.id) ? (
                      <BiListPlus
                        onClick={() =>
                          setAddItems((prev) => [...prev, list.id])
                        }
                        className="text-lg cursor-pointer"
                      />
                    ) : (
                      <BiListMinus
                        onClick={() => {
                          const newIds = addItems.filter((i) => i !== list.id);
                          setAddItems(newIds);
                        }}
                        className="text-lg cursor-pointer"
                      />
                    )}
                    <BsFillShareFill />
                    <BsFillTrashFill
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
                              func: () =>
                                setSystemNotif({
                                  show: false,
                                }),
                            },
                            {
                              text: "delete",
                              func: () => deleteEntireList(list.id),
                            },
                          ],
                        };
                        setSystemNotif(newNotif);
                      }}
                    />
                  </div>
                </div>
                <ListItems
                  listColor={list.color}
                  addItems={addItems}
                  listId={list.id}
                  items={list?.items}
                />
              </Reorder.Item>
            );
          })}
        </Masonry>
      </Reorder.Group>
    </motion.div>
  );
};

export default Lists;
