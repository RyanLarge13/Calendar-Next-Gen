import { useContext, useState } from "react";
import ListItems from "./ListItems";
import { deleteList } from "../utils/api";
import { motion } from "framer-motion";
import { AiOutlinePlus } from "react-icons/ai";
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

  return (
    <motion.div
      // initial={{ height: "0px" }}
      // animate={
      //   showLists
      //     ? {
      //         height: "95vh",
      //         overflowY: "auto",
      //       }
      //     : { height: "0px", overflowY: "hidden" }
      // }
      className="p-3 relative"
    >
      <div className="sticky top-0 right-0 left-0 p-3 mb-5 w-full flex justify-end items-center gap-x-3 rounded-md shadow-md bg-purple-100 z-20">
        <AiOutlinePlus />
      </div>
      {lists.map((list) => (
        <div
          key={list.id}
          className={`my-5 mr-10 p-3 rounded-md shadow-md ${list.color}`}
        >
          <div className="mb-2 bg-white rounded-md shadow-md p-3 flex justify-between items-center">
            <p className="font-semibold">{list.title}</p>
            <div className="flex gap-x-3">
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
          <ListItems addItems={addItems} listId={list.id} items={list?.items} />
        </div>
      ))}
    </motion.div>
  );
};

export default Lists;
