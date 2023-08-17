import { useContext, useState } from "react";
import ListItems from "./ListItems";
import { deleteList } from "../utils/api";
import { motion } from "framer-motion";
import {
  BsFillTrashFill,
  BsFillPenFill,
  BsFillShareFill,
} from "react-icons/bs";
import { BiListMinus, BiListPlus } from "react-icons/bi";
import UserContext from "../context/UserContext";

const Lists = () => {
  const { lists, setLists, setSystemNotif } = useContext(UserContext);
  const [addItems, setAddItems] = useState([]);

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

  const sortItems = (items) => {
    const newSort = items.sort((a, b) => a.orderIndex - b.orderIndex);
    return newSort;
  };

  return (
    <motion.div className="py-3 relative">
      {lists.map((list) => (
        <div
          key={list.id}
          className={`my-5 mr-10 p-3 rounded-md shadow-md ${list.color}`}
        >
          <div className="mb-2 bg-white rounded-md shadow-md p-3 flex justify-between items-center">
            <p className="font-semibold mr-2">{list.title}</p>
            <div className="flex gap-x-3 text-sm">
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
                        func: () => setSystemNotif({ show: false }),
                      },
                      { text: "delete", func: () => deleteEntireList(list.id) },
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
            items={sortItems(list?.items)}
          />
        </div>
      ))}
    </motion.div>
  );
};

export default Lists;
