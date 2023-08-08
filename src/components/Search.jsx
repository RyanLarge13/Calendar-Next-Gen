import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsSearch } from "react-icons/bs";
import InteractiveContext from "../context/InteractiveContext";

const Search = () => {
  const { filters, setFilters } = useContext(InteractiveContext);

  return (
    <AnimatePresence>
      {filters === "search" && (
        <motion.div
          initial={{ y: "-100%", opacity: 0 }}
          exit={{ y: "-100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-20 right-0 left-0 bg-white rounded-md shadow-md pt-5 px-5 pb-2 z-10"
        >
          <div className="flex justify-between items-center">
            <input
              className="w-full h-full p-3 outline-none border-none"
              placeholder="Search events, dates & locations!"
            />
            <BsSearch className="mr-2" />
          </div>
          <div className="flex justify-between items-center mt-2">
            <button onClick={() => setFilters(null)}>cancel</button>
            <button>clear</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Search;
