import { useContext } from "react";
import UserContext from "../context/UserContext";
import Masonry from "react-masonry-css";
import { tailwindBgToHex } from "../utils/helpers.js";
import { BiListPlus } from "react-icons/bi";
import { IoIosAddCircle } from "react-icons/io";
import StickyBody from "./Stickies/StickyBody.jsx";

const StaticStickies = () => {
  const { stickies, preferences } = useContext(UserContext);

  const breakpointColumnsObj = {
    default: 3, // Number of columns by default
    1800: 3,
    1400: 2, // Number of columns on screens > 1100px
    1000: 1,
  };

  return stickies.length > 0 ? (
    <div className="px-3 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {stickies.map((sticky) => (
            <div
              key={sticky.id}
              className={`
            relative overflow-hidden
            rounded-3xl border shadow-sm transition-all duration-200
            ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/7" : "bg-white border-black/10 hover:bg-black/[0.02]"}
            my-4
          `}
            >
              {/* Accent strip */}
              <div
                className={`${sticky.color} absolute left-0 top-0 bottom-0 w-2`}
              />

              {/* Header */}
              <div
                className={`
              px-5 pt-5 pb-4 pl-7
              border-b
              ${preferences.darkMode ? "border-white/10" : "border-black/10"}
            `}
              >
                {/* Title */}
                <input
                  defaultValue={sticky.title}
                  className={`
                            w-full bg-transparent
                            text-lg font-semibold tracking-tight
                            outline-none
                            border-b pb-2
                            ${preferences.darkMode ? "border-white/10 text-white placeholder:text-white/50" : "border-black/10 text-slate-900 placeholder:text-slate-400"}
                          `}
                  style={{ caretColor: tailwindBgToHex(sticky.color) }}
                  placeholder="Title…"
                />
                <p
                  className={`text-xs mt-1 ${preferences.darkMode ? "text-white/55" : "text-slate-500"}`}
                >
                  Sticky note
                </p>
              </div>

              {/* Body */}
              <StickyBody sticky={sticky} />
            </div>
          ))}
        </Masonry>
      </div>
    </div>
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
