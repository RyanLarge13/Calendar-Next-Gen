import { useState } from "react";
import { Reorder } from "framer-motion";

const ListItems = ({ items }) => {
  const [indexes, setIndexes] = useState(items);

  return (
    <Reorder.Group axis="y" values={indexes} onReorder={setIndexes}>
      {indexes?.map((listItem, index) => (
        <Reorder.Item
          whileTap={{ scale: 1.05, backgroundColor: "rgba(255,255,255,1)" }}
          key={listItem}
          value={listItem}
          className="bg-white bg-opacity-20 rounded-md shadow-md px-2 py-3 my-3"
        >
          <p>{listItem}</p>
          {/*<p>{index + 1}</p>*/}
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
};

export default ListItems;
