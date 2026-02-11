import { AnimatePresence, motion } from "framer-motion";
import { useContext, useState } from "react";
import { BsSearch } from "react-icons/bs";
import Portal from "./Portal";
import DatesContext from "../../context/DatesContext";
import InteractiveContext from "../../context/InteractiveContext";
import UserContext from "../../context/UserContext";

const Search = () => {
  const { filters, setFilters } = useContext(InteractiveContext);
  const { setSystemNotif, events, setEvents, preferences, staticEvents } =
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
          initial={{ y: -18, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -18, opacity: 0, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className={`
        fixed z-30
        top-24 left-1/2 !-translate-x-1/2
        w-[92vw] max-w-xl
        rounded-3xl border shadow-2xl overflow-hidden
        ${preferences.darkMode ? "bg-[#161616]/90 border-white/10 text-white" : "bg-white/90 border-black/10 text-slate-900"}
        backdrop-blur-md
        `}
        >
          <Portal>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm"
              onClick={() => setFilters(null)}
              aria-label="Close search"
            />
          </Portal>
          {/* Header */}
          <div
            className={`
            px-5 py-4 flex items-center justify-between gap-3 border-b
            ${preferences.darkMode ? "border-white/10" : "border-black/10"}
          `}
          >
            <div className="min-w-0">
              <p
                className={`text-[11px] font-semibold ${preferences.darkMode ? "text-white/55" : "text-slate-500"}`}
              >
                Search
              </p>
              <h3 className="text-sm font-semibold truncate">
                Find events, dates, and locations
              </h3>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => clearSearchAndFilters()}
                className={`
                px-3 py-2 rounded-2xl border shadow-sm text-xs font-semibold transition active:scale-[0.97]
                ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70 hover:text-rose-200" : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600 hover:text-rose-600"}
              `}
              >
                Clear
              </button>

              <button
                type="button"
                onClick={() => setFilters(null)}
                className={`
                h-9 w-9 grid place-items-center rounded-2xl border shadow-sm transition active:scale-[0.97]
                ${preferences.darkMode ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70" : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"}
              `}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-5 py-5">
            <form onSubmit={(e) => search(e)} className="space-y-3">
              <div
                className={`
                flex items-center gap-3 rounded-3xl border shadow-inner px-4 py-3
                ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-black/[0.03] border-black/10"}
              `}
              >
                <span
                  className={`
                  grid place-items-center h-10 w-10 rounded-2xl border shadow-sm flex-shrink-0
                  ${preferences.darkMode ? "bg-cyan-500/15 border-cyan-300/20 text-cyan-100" : "bg-cyan-50 border-cyan-200 text-cyan-700"}
                `}
                >
                  <BsSearch className="text-lg" />
                </span>

                <input
                  className={`
                  w-full bg-transparent outline-none text-sm font-semibold
                  ${preferences.darkMode ? "text-white placeholder:text-white/45" : "text-slate-900 placeholder:text-slate-400"}
                `}
                  placeholder="Search events, dates & locations…"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  autoFocus
                />

                <button
                  type="submit"
                  className={`
                  px-4 py-2 rounded-2xl text-xs font-semibold shadow-md transition
                  hover:shadow-lg active:scale-[0.97]
                  ${preferences.darkMode ? "bg-cyan-500/25 text-cyan-100 border border-cyan-300/20 hover:bg-cyan-500/30" : "bg-cyan-600 text-white hover:bg-cyan-700"}
                `}
                >
                  Search
                </button>
              </div>

              {/* Bottom actions (mobile-friendly) */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setFilters(null)}
                  className={`
                  px-3 py-2 rounded-2xl border text-xs font-semibold shadow-sm transition active:scale-[0.97]
                  ${preferences.darkMode ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10" : "bg-white border-black/10 text-slate-600 hover:bg-black/[0.02]"}
                `}
                >
                  Cancel
                </button>

                <p
                  className={`text-[11px] font-semibold ${preferences.darkMode ? "text-white/50" : "text-slate-500"}`}
                >
                  Tip: press Enter to search
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Search;
