import React, { useState, useEffect, useRef, useContext } from "react";
import { motion } from "framer-motion";
import Masonry from "react-masonry-css";
import UserContext from "../context/UserContext";
import InteractiveContext from "../context/InteractiveContext";
import DatesContext from "../context/DatesContext";

const MasonryView = () => {
  const { holidays, reminders, eventMap } = useContext(UserContext);
  const { setEvent } = useContext(InteractiveContext);
  const { dateObj } = useContext(DatesContext);

  const [uniqueDates, setUniqueDates] = useState([]);
  const [shouldScroll, setShouldScroll] = useState(false);

  const closestDateRef = useRef(null);

  const breakpointColumnsObj = {
    default: 4, // Number of columns by default
    1700: 4,
    1100: 3, // Number of columns on screens > 1100px
    700: 2, // Number of columns on screens > 700px
  };

  useEffect(() => {
    if (eventMap) {
      const dates = Array.from(new Set(Array.from([...eventMap.keys()])));
      setUniqueDates(dates);
    }
  }, [eventMap]);

  useEffect(() => {
    if (uniqueDates.length > 0) {
      const closestDate = uniqueDates.reduce((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return Math.abs(dateA - dateObj) < Math.abs(dateB - dateObj) ? a : b;
      });
      // Update the closestDateRef with the ref to the element representing the closest date
      const element = document.getElementById(closestDate);
      if (element) {
        closestDateRef.current = element;
        setShouldScroll(true);
      }
    }
  }, [uniqueDates]);

  useEffect(() => {
    // Step 4: Scroll to the closest date element on component mount
    if (closestDateRef.current && shouldScroll) {
      const padding = 50; // Adjust the padding value as needed
      const scrollOptions = {
        behavior: "smooth",
        left: 0,
        top: closestDateRef.current.offsetTop - padding,
      };
      window.scrollTo(scrollOptions);
    }
  }, [shouldScroll]);

  const getHeight = (start, end) => {
    if (!start || !end) {
      return;
    }
    const startMinutes = new Date(start).getMinutes();
    const startHours = new Date(start).getHours();
    const endMinutes = new Date(end).getMinutes();
    const endHours = new Date(end).getHours();
    const totalHours = (endHours - startHours) * 30;
    const totalMinutes = (endMinutes - startMinutes) * 15;
    const result = totalHours + totalMinutes;
    return result;
  };

  return (
    <div className="pb-10">
      {uniqueDates.map((dateString) => {
        const dayEvents = eventMap.get(dateString)?.events || [];

        return (
          <div key={dateString} className="mt-5 border-1 border-gray-400">
            <div className="p-2" id={dateString} ref={closestDateRef}>
              {dayEvents.length > 0 ? (
                <h2 className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent font-semibold text-lg">
                  {new Date(
                    parseInt(dateString.split("-")[0], 10),
                    parseInt(dateString.split("-")[1], 10),
                    1
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </h2>
              ) : null}
            </div>
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {dayEvents.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  style={{
                    minHeight: `${getHeight(
                      event.start.startTime,
                      event.end.endTime
                    )}px`,
                  }}
                  className={`m-3 p-3 whitespace-pre-wrap overflow-hidden rounded-lg shadow-lg ${event.color}`}
                  onClick={() => setEvent(event)}
                >
                  <div className="flex justify-between items-center p-2 font-semibold rounded-md shadow-md mb-2 bg-white">
                    <p>{event.summary}</p>
                    <p>
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-30 rounded-md shadow-md p-2 mb-3">
                    <span className="text-[10px] font-semibold opacity-90">
                      {event.start?.startTime
                        ? `${new Date(event.start.startTime).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )} - `
                        : ""}
                      {event.end?.endTime
                        ? new Date(event.end.endTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>
                  {event.description ? (
                    <p className="bg-white bg-opacity-30 rounded-md shadow-md p-2 whitespace-pre-wrap">
                      {event.description}
                    </p>
                  ) : null}
                </motion.div>
              ))}
            </Masonry>
          </div>
        );
      })}
    </div>
  );
};

export default MasonryView;
