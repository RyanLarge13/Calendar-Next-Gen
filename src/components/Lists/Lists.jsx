import { Reorder, motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { BiListMinus, BiListPlus } from "react-icons/bi";
import { BsFillShareFill, BsFillTrashFill } from "react-icons/bs";
import { IoIosAddCircle } from "react-icons/io";
import { RiFileCopy2Line } from "react-icons/ri";
import Masonry from "react-masonry-css";
import DatesContext from "../../context/DatesContext";
import InteractiveContext from "../../context/InteractiveContext";
import UserContext from "../../context/UserContext";
import { deleteList, updateListTitle } from "../../utils/api";
import ListItems from "./ListItems";
import { useModalActions } from "../../context/ContextHooks/ModalContext";
import List from "./List";

const Lists = ({ listSort, listSortOpt, listSearch, listSearchTxt }) => {
  const { string, setString } = useContext(DatesContext);
  const { lists, preferences } = useContext(UserContext);
  const { setMenu, setType, setAddNewEvent } = useContext(InteractiveContext);

  const { openModal } = useModalActions();

  const breakpointColumnsObj = {
    default: 3, // Number of columns by default
    1800: 3,
    1400: 2, // Number of columns on screens > 1100px
    1000: 1,
  };

  const openModalAndSetType = () => {
    if (!string) {
      setString(dateObj.toLocaleDateString());
    }
    setType("todo-list");
    setMenu(false);
    openModal();
    setAddNewEvent(true);
  };

  return (
    <motion.div className="py-4 px-3 lg:px-6">
      <div className="mx-auto max-w-6xl">
        {lists.length < 1 && (
          <div className="min-h-[55vh] grid place-items-center">
            <div
              className={`
            w-full max-w-md rounded-3xl border shadow-2xl backdrop-blur-md p-5 sm:p-6
            ${preferences.darkMode ? "bg-[#161616]/90 border-white/10 text-white" : "bg-white/90 border-black/10 text-slate-900"}
          `}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`
                  grid place-items-center h-12 w-12 rounded-2xl border shadow-sm
                  ${preferences.darkMode ? "bg-emerald-500/15 border-emerald-300/20 text-emerald-100" : "bg-emerald-50 border-emerald-200 text-emerald-700"}
                `}
                  >
                    <BiListPlus className="text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight">
                      No lists to show
                    </h2>
                    <p
                      className={`text-sm mt-1 ${preferences.darkMode ? "text-white/60" : "text-slate-500"}`}
                    >
                      Create one and start organizing.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => openModalAndSetType()}
                  className={`
                grid place-items-center h-11 w-11 rounded-2xl border shadow-md transition
                hover:scale-[1.02] active:scale-[0.97]
                ${preferences.darkMode ? "bg-white/10 border-white/10 hover:bg-white/15 text-white" : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-700"}
              `}
                  aria-label="Add list"
                >
                  <IoIosAddCircle className="text-2xl" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid_list"
            columnClassName="my-masonry-grid_column_list"
          >
            {lists.map((list) => (
              <List key={list.id} list={list} />
            ))}
          </Masonry>
        </div>
      </div>
    </motion.div>
  );
};

export default Lists;
