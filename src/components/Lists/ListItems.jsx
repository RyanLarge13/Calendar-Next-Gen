import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { AiFillCloseCircle, AiFillPlusCircle } from "react-icons/ai";
import { tailwindBgToHex } from "../../utils/helpers.js";
import { Reorder } from "framer-motion";
import {
  FaSortAlphaDownAlt,
  FaSortAlphaUp,
  FaSortAmountDown,
  FaSortAmountUp
} from "react-icons/fa";
import InteractiveContext from "../../context/InteractiveContext.jsx";
import UserContext from "../../context/UserContext.jsx";

const ListItems = ({ listColor, addItems, listId, items }) => {
  const { listUpdate, setListUpdate } = useContext(InteractiveContext);
  const { setSystemNotif } = useContext(UserContext);
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
        a.text.toLowerCase() > b.text.toLowerCase() ? 1 : -1
      );
      setIndexes(newSort);
    }
    if (sortOrder === 3) {
      const newSort = itemsCopy.sort((a, b) =>
        b.text.toLowerCase() > a.text.toLowerCase() ? 1 : -1
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

  const removeItem = item => {
    const newList = indexes.filter(i => i.id !== item.id);
    setIndexes(newList);
    const contains = listUpdate.find(li => li.listId === listId);
    if (contains) {
      listUpdate[listUpdate.indexOf(contains)].listItems = newList;
    }
    if (!contains) {
      const newObj = {
        listId: listId,
        listItems: newList
      };
      setListUpdate(prev => [...prev, newObj]);
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
          { text: "close", func: () => setSystemNotif({ show: false }) }
        ]
      };
      return setSystemNotif(newNotif);
    }
    if (newItemText) {
      const newItem = {
        id: uuidv4(),
        text: newItemText,
        orderIndex: items.length + 1,
        complete: false
      };
      const newList = [...indexes, newItem];
      setIndexes(newList);
      const contains = listUpdate.find(li => li.listId === listId);
      if (contains) {
        listUpdate[listUpdate.indexOf(contains)].listItems = newList;
      }
      if (!contains) {
        const newObj = {
          listId: listId,
          listItems: [...items, newItem]
        };
        setListUpdate(prev => [...prev, newObj]);
      }
    }
    setNewItemText("");
  };

  const updateOrderIndexes = newIndexes => {
    setIndexes(newIndexes);
    // Update the orderIndex values of the items based on the new indexes
    const updatedItems = newIndexes.map((item, newIndex) => ({
      ...item,
      orderIndex: newIndex + 1
    }));
    // Check if the listId exists in the listUpdate array
    const containsListId = listUpdate.some(list => list.listId === listId);
    // Update the listUpdate context with the new reordered list
    const updatedListUpdate = containsListId
      ? listUpdate.map(list =>
          list.listId === listId ? { ...list, listItems: updatedItems } : list
        )
      : [...listUpdate, { listId, listItems: updatedItems }];
    setListUpdate(updatedListUpdate);
  };

  return (
    <>
      <div className="mb-2 bg-white rounded-md shadow-md p-3 flex justify-start items-center gap-x-3">
        <button onClick={() => setSortOrder(2)}>
          <FaSortAlphaUp />
        </button>
        <button onClick={() => setSortOrder(3)}>
          <FaSortAlphaDownAlt />
        </button>
        <button onClick={() => setSortOrder(1)}>
          <FaSortAmountDown />
        </button>
        <button onClick={() => setSortOrder(4)}>
          <FaSortAmountUp />
        </button>
      </div>
      {addItems.includes(listId) && (
        <div className="flex justify-between items-center p-3 rounded-md shadow-md">
          <form
            onSubmit={e => {
              e.preventDefault();
              addNewItem();
            }}
          >
            <input
              type="text"
              className="rounded-md shadow-md px-3 py-2 outline-none"
              placeholder="New Item"
              value={newItemText}
              onChange={e => setNewItemText(e.target.value)}
              autoFocus={true}
            />
          </form>
          <AiFillPlusCircle
            onClick={() => addNewItem()}
            className="text-lg cursor-pointer"
          />
        </div>
      )}
      <Reorder.Group axis="y" values={indexes} onReorder={updateOrderIndexes}>
        {indexes?.map((listItem, index) => (
          <Reorder.Item
            whileDrag={{
              scale: 1.025,
              backgroundColor: "rgba(255,255,255,1)",
              cursor: "grabbing"
            }}
            key={listItem.id}
            value={listItem}
            className="bg-white bg-opacity-20 rounded-md ml-0 shadow-md px-2 py-5 my-3 flex justify-between items-center cursor-grab relative"
          >
            <div>
              <p className="absolute top-[-6px] left-[-6px] w-[15px] h-[15px] shadow-md flex justify-center items-center rounded-full bg-white text-xs">
                {index + 1}
              </p>
              <p
              style={{color: tailwindBgToHex(listColor)}}
              className="mr-5 text-sm">{listItem.text}</p>
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
