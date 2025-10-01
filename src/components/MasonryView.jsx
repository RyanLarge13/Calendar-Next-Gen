import React, { useState, useEffect, useRef, useContext } from "react";
import { motion } from "framer-motion";
import Masonry from "react-masonry-css";
import UserContext from "../context/UserContext";
import InteractiveContext from "../context/InteractiveContext";
import DatesContext from "../context/DatesContext";

const MasonryView = ({ containerRef }) => {
  const { holidays, reminders, eventMap } = useContext(UserContext);
  const { setEvent } = useContext(InteractiveContext);
  const { dateObj } = useContext(DatesContext);

  const [uniqueDates, setUniqueDates] = useState([]);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [refDate, setRefDate] = useState(null);

  const closestDateRef = useRef(null);
  const dateMapRef = useRef(null);

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

  // AI implementation of my attempt of scrolling sync behavior commented out below
  useEffect(() => {
    let containerTimeout = null;
    let dateMapTimeout = null;

    const SYNC_DELAY = 50; // ms debounce so we wait for user scroll to settle

    const handleContainerScroll = () => {
      if (!containerRef.current || !dateMapRef.current) return;

      // clear any pending syncs
      if (containerTimeout) clearTimeout(containerTimeout);

      containerTimeout = setTimeout(() => {
        const container = containerRef.current;
        const map = dateMapRef.current;

        const ratio =
          container.scrollTop /
          (container.scrollHeight - container.clientHeight);

        map.scrollTo({
          top: ratio * (map.scrollHeight - map.clientHeight),
          behavior: "smooth",
        });
      }, SYNC_DELAY);
    };

    const handleDateMapScroll = () => {
      if (!dateMapRef.current || !containerRef.current) return;

      if (dateMapTimeout) clearTimeout(dateMapTimeout);

      dateMapTimeout = setTimeout(() => {
        const container = containerRef.current;
        const map = dateMapRef.current;

        const ratio = map.scrollTop / (map.scrollHeight - map.clientHeight);

        container.scrollTo({
          top: ratio * (container.scrollHeight - container.clientHeight),
          behavior: "smooth",
        });
      }, SYNC_DELAY);
    };

    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.addEventListener("scroll", handleContainerScroll);
      }
      if (dateMapRef.current) {
        dateMapRef.current.addEventListener("scroll", handleDateMapScroll);
      }
    }, 2000);

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener(
          "scroll",
          handleContainerScroll
        );
      }
      if (dateMapRef.current) {
        dateMapRef.current.removeEventListener("scroll", handleDateMapScroll);
      }
      if (containerTimeout) clearTimeout(containerTimeout);
      if (dateMapTimeout) clearTimeout(dateMapTimeout);
    };
  }, []);

  // Testing AI, commenting out bottom code to see if AI can replace it with one that properly waits for scroll events to finish. AI implementation above
  // useEffect(() => {
  //   let isSyncingContainer = false;
  //   let isSyncingDateMap = false;

  //   const handleContainerScroll = () => {
  //     if (isSyncingDateMap) return;
  //     if (dateMapRef.current && containerRef.current) {
  //       isSyncingContainer = true;
  //       const container = containerRef.current;
  //       const map = dateMapRef.current;

  //       const ratio =
  //         container.scrollTop /
  //         (container.scrollHeight - container.clientHeight);

  //       map.scrollTo({
  //         top: ratio * (map.scrollHeight - map.clientHeight),
  //         behavior: "smooth",
  //       });
  //     }
  //   };

  //   const handleDateMapScroll = () => {
  //     if (isSyncingContainer) return;
  //     isSyncingDateMap = true;
  //     if (dateMapRef.current && containerRef.current) {
  //       const container = containerRef.current;
  //       const map = dateMapRef.current;

  //       const ratio = map.scrollTop / (map.scrollHeight - map.clientHeight);

  //       container.scrollTo({
  //         top: ratio * (container.scrollHeight - container.clientHeight),
  //         behavior: "smooth",
  //       });
  //     }
  //   };

  //   const scrollEndContainerRef = () => {
  //     isSyncingContainer = false;
  //   };

  //   const scrollEndDateMapRef = () => {
  //     isSyncingDateMap = false;
  //   };

  //   if (containerRef.current) {
  //     containerRef.current.addEventListener("scroll", handleContainerScroll);
  //     containerRef.current.addEventListener("scrollend", scrollEndContainerRef);
  //   }
  //   if (dateMapRef.current) {
  //     dateMapRef.current.addEventListener("scroll", handleDateMapScroll);
  //     dateMapRef.current.addEventListener("scrollend", scrollEndDateMapRef);
  //   }

  //   return () => {
  //     if (containerRef.current) {
  //       containerRef.current.removeEventListener(
  //         "scroll",
  //         handleContainerScroll
  //       );
  //       containerRef.current.removeEventListener(
  //         "scrollend",
  //         scrollEndContainerRef
  //       );
  //     }
  //     if (dateMapRef.current) {
  //       dateMapRef.current.removeEventListener("scroll", handleDateMapScroll);
  //       dateMapRef.current.removeEventListener(
  //         "scrollend",
  //         scrollEndDateMapRef
  //       );
  //     }
  //   };
  // }, []);

  useEffect(() => {
    if (uniqueDates.length > 0) {
      const closestDate = uniqueDates.reduce((a, b) => {
        const dateA = new Date(
          parseInt(a.split("-")[0], 10),
          parseInt(a.split("-")[1], 10),
          1
        );
        const dateB = new Date(
          parseInt(b.split("-")[0], 10),
          parseInt(b.split("-")[1], 10),
          1
        );
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
    if (closestDateRef.current && shouldScroll && containerRef?.current) {
      const padding = 50; // Adjust the padding value as needed
      const scrollOptions = {
        behavior: "smooth",
        left: 0,
        top: closestDateRef.current.offsetTop - padding,
      };
      containerRef.current.scrollTo(scrollOptions);
    }
  }, [shouldScroll, dateObj]);

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

  const scrollToArea = (dateStr) => {
    const element = document.getElementById(dateStr);
    if (element && containerRef?.current) {
      const padding = 0; // Adjust the padding value as needed
      const scrollOptions = {
        behavior: "smooth",
        left: 0,
        top: element.offsetTop - padding,
      };
      containerRef.current.scrollTo(scrollOptions);
      setRefDate(dateStr);
    }
  };

  return (
    <div className="pb-10 flex w-full max-w-screen">
      <div
        className="sticky top-0 left-0 ml-2 min-w-16 max-w-16 h-[100vh] overflow-y-scroll scrollbar-hide"
        ref={dateMapRef}
      >
        {uniqueDates.map((d) => {
          const dayEventsLen = eventMap.get(d)?.events.length || 0;

          return dayEventsLen > 0 ? (
            <button
              key={d}
              onClick={() => scrollToArea(d)}
              className={`text-sm p-3 my-3 w-16 flex justify-center items-center border bg-gradient-to-r
                 from-purple-500 via-blue-500 to-black to-[80%] rounded-md bg-clip-text text-transparent bg-[length:200%_100%] 
                 transition-[background-position] duration-700 ease-in-out ${
                   refDate === d
                     ? "bg-left font-semibold shadow-lg"
                     : "bg-right shadow-none"
                 }
`}
            >
              <p>
                {new Date(
                  parseInt(d.split("-")[0], 10),
                  parseInt(d.split("-")[1], 10),
                  1
                ).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </button>
          ) : null;
        })}
      </div>
      <div className="flex-1 min-w-0 ml-0">
        {uniqueDates.map((dateString) => {
          const dayEvents = eventMap.get(dateString)?.events || [];

          return (
            <div key={dateString} className="mt-10 border-1 border-gray-400">
              <div className="p-2" id={dateString}>
                {dayEvents.length > 0 ? (
                  <h2 className="bg-gradient-to-r ml-2 from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent font-semibold text-lg">
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
                    className="my-3 relative p-2 pl-4 whitespace-pre-wrap overflow-hidden rounded-xl border shadow-lg"
                    onClick={() => setEvent(event)}
                  >
                    <div
                      className={`w-2 rounded-l-xl absolute left-0 top-0 bottom-0 ${event.color}`}
                    ></div>
                    <p className="mb-1 text-sm font-semibold truncate">
                      {event.summary}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    {event.start.startTime && event.end.endTime ? (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {event.start?.startTime
                          ? `${new Date(
                              event.start.startTime
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })} - `
                          : ""}
                        {event.end?.endTime
                          ? new Date(event.end.endTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        All Day Event
                      </p>
                    )}
                    {event.description ? (
                      <p className="text-xs leading-snug text-gray-500 whitespace-pre-wrap">
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
    </div>
  );
};

export default MasonryView;
