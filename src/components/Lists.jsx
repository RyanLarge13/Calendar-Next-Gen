import { useContext } from "react";
import ListItems from "./ListItems";
import { deleteList } from "../utils/api";
import { motion } from "framer-motion";
import {
  BsFillTrashFill,
  BsFillPenFill,
  BsFillShareFill,
} from "react-icons/bs";
import UserContext from "../context/UserContext";

const Lists = ({ showLists }) => {
  const { lists, setLists } = useContext(UserContext);

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
          className={`my-5 mx-2 p-3 rounded-md shadow-md ${list.color}`}
        >
          <div className="mb-2 bg-white rounded-md shadow-md p-3 flex justify-between items-center">
            <p>{list.title}</p>
            <div className="flex gap-x-3">
              <BsFillShareFill />
              <BsFillPenFill />{" "}
              <BsFillTrashFill onClick={() => deleteEntireList(list.id)} />
            </div>
          </div>
          <ListItems items={list?.items} />
        </div>
      ))}
    </motion.div>
  );
};

export default Lists;
