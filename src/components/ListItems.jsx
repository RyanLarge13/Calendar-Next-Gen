import { useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { Reorder } from "framer-motion";

const ListItems = ({ items }) => {
  const [indexes, setIndexes] = useState(items);

  return (
    <Reorder.Group axis="y" values={indexes} onReorder={setIndexes}>
      {indexes?.map((listItem, index) => (
        <Reorder.Item
          whileDrag={{
            scale: 1.05,
            backgroundColor: "rgba(255,255,255,1)",
            cursor: "grabbing",
          }}
          key={listItem}
          value={listItem}
          className="bg-white bg-opacity-20 rounded-md shadow-md px-2 py-5 my-3 flex justify-between items-center cursor-grab relative"
        >
          <div>
            <p className="absolute top-[-6px] left-[-6px] w-[15px] h-[15px] shadow-md flex justify-center items-center rounded-full bg-white">
              {index + 1}
            </p>
            <p>{listItem}</p>
          </div>
          <AiFillCloseCircle className="cursor-pointer text-lg" />
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
};

export default ListItems;
