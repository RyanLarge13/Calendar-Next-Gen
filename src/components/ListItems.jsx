import { useContext, useState } from "react";
import { AiFillCloseCircle, AiFillPlusCircle } from "react-icons/ai";
import { Reorder } from "framer-motion";
import InteractiveContext from "../context/InteractiveContext";

const ListItems = ({ addItems, listId, items }) => {
  const { listUpdate, setListUpdate } = useContext(InteractiveContext);
  const [indexes, setIndexes] = useState(items);
  const [newItemText, setNewItemText] = useState("");

  const removeItem = (item) => {
    const newList = indexes.filter((i) => i !== item);
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
    if (newItemText) {
      setIndexes((prev) => [...prev, newItemText]);
      setNewItemText("");
      const contains = listUpdate.find((li) => li.listId === listId);
      if (contains) {
        listUpdate[listUpdate.indexOf(contains)].listItems = newList;
      }
      if (!contains) {
        const newObj = {
          listId: listId,
          listItems: [...items, newItemText],
        };
        setListUpdate((prev) => [...prev, newObj]);
      }
    }
  };

  return (
    <>
      {addItems.includes(listId) && (
        <div className="flex justify-between items-center p-3 rounded-md shadow-md">
          <input
            className="rounded-md shadow-md px-3 py-2 outline-none"
            placeholder="New Item"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
          />
          <AiFillPlusCircle
            onClick={() => addNewItem()}
            className="text-lg cursor-pointer"
          />
        </div>
      )}
      <Reorder.Group axis="y" values={indexes} onReorder={setIndexes}>
        {indexes?.map((listItem, index) => (
          <Reorder.Item
            whileDrag={{
              scale: 1.025,
              backgroundColor: "rgba(255,255,255,1)",
              cursor: "grabbing",
            }}
            key={listItem}
            value={listItem}
            className="bg-white bg-opacity-20 rounded-md shadow-md px-2 py-5 my-3 flex justify-between items-center cursor-grab relative"
          >
            <div>
              <p className="absolute top-[-6px] left-[-6px] w-[15px] h-[15px] shadow-md flex justify-center items-center rounded-full bg-white text-xs">
                {index + 1}
              </p>
              <p className="mr-5 text-sm">{listItem}</p>
            </div>
            <div>
              <AiFillCloseCircle
                onClick={() => removeItem(listItem)}
                className="cursor-pointer text-lg"
              />
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </>
  );
};

export default ListItems;
