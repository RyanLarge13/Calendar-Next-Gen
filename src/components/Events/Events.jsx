import React, { useContext, useEffect, useMemo, useState } from "react";
import { BiSearch } from "react-icons/bi";
import {
  FaCalendarAlt,
  FaSortAmountDown,
  FaSortAmountUp,
  FaSortAlphaDownAlt,
  FaSortAlphaUp,
} from "react-icons/fa";
import { MdEventAvailable, MdOutlineUpcoming } from "react-icons/md";
import UserContext from "../../context/UserContext";
import EventCard from "./EventCard";

const Events = () => {
  const { preferences, eventMap } = useContext(UserContext);

  const [allEvents, setAllEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("newest");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    if (!eventMap) return;

    const eventBucket = [];

    eventMap.forEach((value) => {
      const events = value?.events || [];

      events.forEach((event) => {
        eventBucket.push(event);
      });
    });

    // Prevent duplicate events if repeats/clones exist in multiple map buckets
    const uniqueEvents = Array.from(
      new Map(eventBucket.map((event) => [event.id, event])).values(),
    );

    setAllEvents(uniqueEvents);
  }, [eventMap]);

  const getEventDate = (event) => {
    const rawDate =
      event?.start?.startTime ||
      event?.startDate ||
      event?.date ||
      event?.createdAt;

    return rawDate ? new Date(rawDate) : new Date(0);
  };

  const visibleEvents = useMemo(() => {
    const now = new Date();

    let events = [...allEvents];

    if (search.trim()) {
      const q = search.toLowerCase();

      events = events.filter((event) => {
        const title = event?.title || event?.name || "";
        const description = event?.description || "";
        const location = event?.location?.string || "";

        return (
          title.toLowerCase().includes(q) ||
          description.toLowerCase().includes(q) ||
          location.toLowerCase().includes(q)
        );
      });
    }

    if (filterType === "upcoming") {
      events = events.filter((event) => getEventDate(event) >= now);
    }

    if (filterType === "past") {
      events = events.filter((event) => getEventDate(event) < now);
    }

    if (filterType === "repeating") {
      events = events.filter((event) => event?.repeats?.repeat);
    }

    if (sortType === "newest") {
      events.sort((a, b) => getEventDate(b) - getEventDate(a));
    }

    if (sortType === "oldest") {
      events.sort((a, b) => getEventDate(a) - getEventDate(b));
    }

    if (sortType === "az") {
      events.sort((a, b) =>
        (a?.title || a?.name || "").localeCompare(b?.title || b?.name || ""),
      );
    }

    if (sortType === "za") {
      events.sort((a, b) =>
        (b?.title || b?.name || "").localeCompare(a?.title || a?.name || ""),
      );
    }

    return events;
  }, [allEvents, search, sortType, filterType]);

  const buttonBase = `
    h-10 px-3 grid place-items-center rounded-2xl border shadow-sm transition
    hover:shadow-md active:scale-[0.97] text-xs font-semibold
  `;

  const softButton = preferences.darkMode
    ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
    : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600";

  const activeButton = preferences.darkMode
    ? "bg-cyan-500/15 border-cyan-300/20 text-cyan-100"
    : "bg-cyan-50 border-cyan-200 text-cyan-700";

  return (
    <div className="space-y-4 py-5">
      <div
        className={`
          rounded-[2rem] border shadow-sm p-4 sm:p-5
          ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-white border-black/10"}
        `}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p
              className={`text-xs font-semibold tracking-wide flex items-center gap-2 ${
                preferences.darkMode ? "text-cyan-100/80" : "text-cyan-700"
              }`}
            >
              <FaCalendarAlt />
              Event Hub
            </p>

            <h2
              className={`text-2xl font-bold mt-1 ${
                preferences.darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              All Events
            </h2>

            <p
              className={`text-sm mt-1 ${
                preferences.darkMode ? "text-white/50" : "text-slate-500"
              }`}
            >
              Search, sort, and quickly jump back into anything you have
              created.
            </p>
          </div>

          <div
            className={`
              rounded-3xl border px-4 py-3 shadow-sm
              ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-black/[0.03] border-black/10"}
            `}
          >
            <p
              className={`text-[11px] font-semibold ${
                preferences.darkMode ? "text-white/45" : "text-slate-500"
              }`}
            >
              Showing
            </p>

            <p
              className={`text-xl font-bold ${
                preferences.darkMode ? "text-white" : "text-slate-900"
              }`}
            >
              {visibleEvents.length}
              <span className="text-sm font-semibold opacity-50">
                {" "}
                / {allEvents.length}
              </span>
            </p>
          </div>
        </div>

        <div
          className={`
            mt-4 rounded-3xl border shadow-inner px-4 py-3
            flex items-center gap-3
            ${preferences.darkMode ? "bg-[#161616]/40 border-white/10" : "bg-black/[0.03] border-black/10"}
          `}
        >
          <BiSearch
            className={`text-2xl ${
              preferences.darkMode ? "text-white/40" : "text-slate-400"
            }`}
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title, notes, or location..."
            className={`
              w-full bg-transparent outline-none text-sm font-semibold
              ${
                preferences.darkMode
                  ? "text-white placeholder:text-white/35"
                  : "text-slate-900 placeholder:text-slate-400"
              }
            `}
          />
        </div>
      </div>

      <div
        className={`
          rounded-3xl border shadow-sm p-3
          flex items-center gap-2 flex-wrap
          ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-white border-black/10"}
        `}
      >
        <p
          className={`text-[11px] font-semibold tracking-wide mr-1 ${
            preferences.darkMode ? "text-white/55" : "text-slate-500"
          }`}
        >
          Filter
        </p>

        <button
          type="button"
          onClick={() => setFilterType("all")}
          className={`${buttonBase} ${filterType === "all" ? activeButton : softButton}`}
        >
          All
        </button>

        <button
          type="button"
          onClick={() => setFilterType("upcoming")}
          className={`${buttonBase} ${filterType === "upcoming" ? activeButton : softButton}`}
        >
          <p className="flex justify-center items-center gap-x-2">
            Upcoming
            <MdOutlineUpcoming className="text-base mr-1 mt-[-2px]" />
          </p>
        </button>

        <button
          type="button"
          onClick={() => setFilterType("past")}
          className={`${buttonBase} ${filterType === "past" ? activeButton : softButton}`}
        >
          Past
        </button>

        <button
          type="button"
          onClick={() => setFilterType("repeating")}
          className={`${buttonBase} ${filterType === "repeating" ? activeButton : softButton}`}
        >
          Repeating
        </button>

        <div
          className={`h-6 w-px mx-1 ${
            preferences.darkMode ? "bg-white/10" : "bg-black/10"
          }`}
        />

        <p
          className={`text-[11px] font-semibold tracking-wide mr-1 ${
            preferences.darkMode ? "text-white/55" : "text-slate-500"
          }`}
        >
          Sort
        </p>

        <button
          type="button"
          onClick={() => setSortType("newest")}
          className={`${buttonBase} ${sortType === "newest" ? activeButton : softButton}`}
          title="Newest first"
        >
          <FaSortAmountDown />
        </button>

        <button
          type="button"
          onClick={() => setSortType("oldest")}
          className={`${buttonBase} ${sortType === "oldest" ? activeButton : softButton}`}
          title="Oldest first"
        >
          <FaSortAmountUp />
        </button>

        <button
          type="button"
          onClick={() => setSortType("az")}
          className={`${buttonBase} ${sortType === "az" ? activeButton : softButton}`}
          title="A → Z"
        >
          <FaSortAlphaUp />
        </button>

        <button
          type="button"
          onClick={() => setSortType("za")}
          className={`${buttonBase} ${sortType === "za" ? activeButton : softButton}`}
          title="Z → A"
        >
          <FaSortAlphaDownAlt />
        </button>
      </div>

      {visibleEvents.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {visibleEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div
          className={`
            rounded-[2rem] border shadow-sm p-8 text-center
            ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-white border-black/10"}
          `}
        >
          <MdEventAvailable
            className={`text-4xl mx-auto mb-3 ${
              preferences.darkMode ? "text-white/35" : "text-slate-300"
            }`}
          />

          <p
            className={`text-lg font-bold ${
              preferences.darkMode ? "text-white/80" : "text-slate-800"
            }`}
          >
            No events found
          </p>

          <p
            className={`text-sm mt-1 ${
              preferences.darkMode ? "text-white/45" : "text-slate-500"
            }`}
          >
            Try changing your search or filter.
          </p>
        </div>
      )}
    </div>
  );
};

export default Events;
