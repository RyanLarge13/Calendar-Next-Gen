import { AnimatePresence, motion } from "framer-motion";
import { useContext, useState } from "react";
import { BsSearch } from "react-icons/bs";
import DatesContext from "../../context/DatesContext";
import InteractiveContext from "../../context/InteractiveContext";
import UserContext from "../../context/UserContext";

const Search = () => {
  const { filters, setFilters } = useContext(InteractiveContext);
  const { setSystemNotif, events, setEvents, staticEvents } =
    useContext(UserContext);
  const { setUpdatedDate } = useContext(DatesContext);

  const [searchText, setSearchText] = useState("");

  const search = (e) => {
    e.preventDefault();
    if (!searchText) {
      const newError = {
        show: true,
        title: "No Search Value",
        text: "Please type in a value to search through your data",
        color: "bg-red-200",
        hasCancel: false,
        actions: [
          {
            text: "close",
            func: () => setSystemNotif({ show: false }),
          },
        ],
      };
      return setSystemNotif(newError);
    }
    const unbiasedUserInput = searchText.toLowerCase();
    const filteredEvents = events.filter((event) => {
      const eventTitle = event.summary.toLowerCase();
      const eventDescription = event.description.toLowerCase();
      return (
        event.date.includes(unbiasedUserInput) ||
        eventTitle.includes(unbiasedUserInput) ||
        eventDescription.includes(unbiasedUserInput)
      );
    });
    const firstInstanceOfDate = filteredEvents[0].date;
    setUpdatedDate(firstInstanceOfDate);
    setEvents(filteredEvents);
  };

  const clearSearchAndFilters = () => {
    setSearchText("");
    setEvents(staticEvents);
  };

  return (
    <AnimatePresence>
      {filters === "search" && (
        <motion.div
          initial={{ y: "-100%", opacity: 0 }}
          exit={{ y: "-100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed top-20 right-0 left-0 bg-white rounded-md shadow-md pt-5 px-5 pb-2 z-10"
        >
          <form onSubmit={(e) => search(e)}>
            <div className="flex justify-between items-center">
              <input
                className="w-full h-full p-3 outline-none border-none"
                placeholder="Search events, dates & locations!"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button type="submit">
                <BsSearch className="mr-2" />
              </button>
            </div>
          </form>
          <div className="flex justify-between items-center mt-2">
            <button type="text" onClick={() => setFilters(null)}>
              cancel
            </button>
            <button type="text" onClick={() => clearSearchAndFilters()}>
              clear
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Search;
