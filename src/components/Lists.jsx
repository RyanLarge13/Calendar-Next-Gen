import { useContext, useEffect, useState } from "react";
import ListItems from "./ListItems";
import { deleteList } from "../utils/api";
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
    default: 3, // Number of columns by default
    1100: 2, // Number of columns on screens > 1100px
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
        <div className="px-3">
          <div className="rounded-md p-3 shadow-md my-5 flex justify-between items-center">
            <div>
              <h2 className="font-semibold mb-2">You have no lists</h2>
              <BiListPlus />
            </div>
            <div className="text-2xl p-2" onClick={() => openModalAndSetType()}>
              <IoIosAddCircle />
            </div>
          </div>
        </div>
      )}
      <Reorder.Group
        values={listsToRender}
        onReorder={setListsToRender}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-10 list-none"
        // comment out grid styles if using masonry
      >
        {/* <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        > */}
        {listsToRender.map((list) => (
          <Reorder.Item
            key={list.id}
            value={list}
            drag
            className={`scrollbar-hide p-3 rounded-md
            shadow-md ${list.color} my-5 mx-0 mr-7 md:mr-0 pr-10 md:pr-3
            text-black list-none`}
          >
            <div className="mb-2 bg-white rounded-md shadow-md p-3 flex justify-between items-center">
              <p className="font-semibold mr-2">{list.title}</p>
              <div className="flex gap-x-3 text-sm">
                <button onClick={() => copyAsPlainText(list.items)}>
                  {" "}
                  <RiFileCopy2Line />
                </button>
                {!addItems.includes(list.id) ? (
                  <BiListPlus
                    onClick={() => setAddItems((prev) => [...prev, list.id])}
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
                <BsFillPenFill />
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
              addItems={addItems}
              listId={list.id}
              items={list?.items}
            />
          </Reorder.Item>
        ))}
        {/* </Masonry> */}
      </Reorder.Group>
    </motion.div>
  );
};

export default Lists;
