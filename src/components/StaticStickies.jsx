import { useContext } from "react";
import UserContext from "../context/UserContext";
import Masonry from "react-masonry-css";
import { tailwindBgToHex } from "../utils/helpers.js";
import { BiListPlus } from "react-icons/bi";
import { IoIosAddCircle } from "react-icons/io";

const StaticStickies = () => {
  const { stickies } = useContext(UserContext);

  const breakpointColumnsObj = {
    default: 4, // Number of columns by default
    1700: 3,
    1100: 2, // Number of columns on screens > 1100px
    700: 1, // Number of columns on screens > 700px
  };

  return stickies.length > 0 ? (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {stickies.map((sticky) => (
        <div
          key={sticky.id}
          className={`${sticky.color} w-full max-h-screen overflow-auto 
  p-6 rounded-2xl shadow-lg my-5 transition-all duration-300`}
        >
          <p
            style={{
              color: tailwindBgToHex(sticky.color),
            }}
            className="text-xl font-semibold mb-4 border-b pb-2 border-black/20"
          >
            {sticky.title}
          </p>
          <div
            style={{
              color: tailwindBgToHex(sticky.color),
            }}
            dangerouslySetInnerHTML={{ __html: sticky.body }}
            className="markdown scrollbar-slick text-base leading-relaxed"
          ></div>
        </div>
      ))}
    </Masonry>
  ) : (
    <button className="px-3">
      <div className="rounded-md p-3 shadow-md my-5 flex justify-between items-center">
        <div>
          <h2 className="font-semibold mb-2">You have no sticky notes</h2>
          <BiListPlus />
        </div>
        <div className="text-2xl p-2" onClick={() => openModalAndSetType()}>
          <IoIosAddCircle />
        </div>
      </div>
    </button>
  );
};

export default StaticStickies;
