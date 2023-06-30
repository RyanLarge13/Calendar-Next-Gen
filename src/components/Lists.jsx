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

const Lists = ({ showLists }) => {
  const { lists, setLists } = useContext(UserContext);
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
      initial={{ height: "0px" }}
      animate={
        showLists
          ? {
              height: "max-content",
            }
          : { height: "0px" }
      }
      className="p-3 overflow-hidden shadow-sm"
    >
      {lists.map((list) => (
        <div
          key={list.id}
          className={`my-5 ml-2 mr-10 p-3 rounded-md shadow-md ${list.color}`}
        >
          <div className="mb-2 bg-white rounded-md shadow-md p-3 flex justify-between items-center">
            <p>{list.title}</p>
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
              <BsFillTrashFill onClick={() => deleteEntireList(list.id)} />
            </div>
          </div>
          <ListItems addItems={addItems} listId={list.id} items={list?.items} />
        </div>
      ))}
    </motion.div>
  );
};

export default Lists;
