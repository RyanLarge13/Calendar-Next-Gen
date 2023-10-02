import React, { useState, useEffect, useRef, useContext } from "react";
import { motion } from "framer-motion";
import Masonry from "react-masonry-css";
import UserContext from "../context/UserContext";
import InteractiveContext from "../context/InteractiveContext";
import DatesContext from "../context/DatesContext";

const MasonryView = () => {
  const { events, holidays, reminders } = useContext(UserContext);
  const { setEvent } = useContext(InteractiveContext);
  const { dateObj } = useContext(DatesContext);

  const [uniqueDates, setUniqueDates] = useState([]);
  const [shouldScroll, setShouldScroll] = useState(false);

  const closestDateRef = useRef(null);

  const breakpointColumnsObj = {
    default: 3, // Number of columns by default
    1100: 2, // Number of columns on screens > 1100px
    700: 1, // Number of columns on screens > 700px
  };

  useEffect(() => {
    const allDates = events.map((event) => event.date);
    const dateObjects = allDates.map((dateString) => new Date(dateString));
    dateObjects.sort((a, b) => a - b);
    const sortedDatesArray = dateObjects.map((date) =>
      date.toLocaleDateString()
    );
    const uniqueSet = new Set(sortedDatesArray);
    const uniqueDatesArray = Array.from(uniqueSet);
    setUniqueDates(uniqueDatesArray);
  }, [events, reminders]);

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
      {uniqueDates.map((dateString) => (
        <div key={dateString} className="mt-5">
          <div
            className="rounded-md p-2 shadow-md flex justify-between items-center"
            id={dateString}
            ref={closestDateRef}
          >
            <h2 className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              {dateString}
            </h2>
            <div></div>
          </div>
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {events.map(
              (event) =>
                event.date === dateString && (
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
                    className={`m-2 p-3 rounded-md shadow-md ${event.color}`}
                    onClick={() => setEvent(event)}
                  >
                    <p className="p-2 font-semibold rounded-md shadow-md mb-2 bg-white">
                      {event.summary}
                    </p>
                    {event.description && (
                      <p className="bg-white bg-opacity-30 rounded-md shadow-md p-2">
                        {event.description
                          .split(/\|\|\||\n/)
                          .map((line, index) => (
                            <React.Fragment key={index}>
                              {line}
                              <br />
                            </React.Fragment>
                          ))}
                      </p>
                    )}
                  </motion.div>
                )
            )}
          </Masonry>
        </div>
      ))}
    </div>
  );
};

export default MasonryView;
