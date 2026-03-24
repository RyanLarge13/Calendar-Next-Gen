import { motion } from "framer-motion";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import DatesContext from "../../../context/DatesContext.jsx";
import UserContext from "../../../context/UserContext.jsx";
import { calendar } from "../../../motion.js";
import { cloneEventForDay, eventOccursOnDay } from "../../../utils/helpers.js";
import DayCell from "./DayCell.jsx";

const MonthView = () => {
  const { eventMap } = useContext(UserContext);
  const { paddingDays, daysInMonth, month, year, day, dateObj } =
    useContext(DatesContext);

  const cloneMap = useRef(new Map());

  useEffect(() => {
    selected.length > 0 ? setConfirmDates(true) : setConfirmDates(false);
  }, [selected]);

  const getIndicesForEvents = useCallback(
    (dtStr) => {
      const targetDateObj = new Date(dtStr);
      targetDateObj.setHours(0, 0, 0, 0);
      const key = `${year}-${month}`;
      const baseEvents = eventMap.get(key)?.events || [];
      const eventsToSort = [...baseEvents];
      const repeatEvents = eventMap.get("repeat-events")?.events || [];

      const cloneKey = `${year}-${month}-${dtStr}`;

      if (cloneMap.has(cloneKey)) {
        const eventClones = cloneMap.get(cloneKey).events;
        eventsToSort.push(eventClones);
      } else {
        if (repeatEvents.length > 0) {
          repeatEvents.forEach((e) => {
            const eLandsOnDay = eventOccursOnDay(e, dtStr);
            if (eLandsOnDay) {
              const eventRepeated = cloneEventForDay(e, new Date(dtStr));

              if (cloneMap.has(cloneKey)) {
                cloneMap.get(cloneKey).events.push(eventRepeated);
              } else {
                cloneMap.set(cloneKey, { events: [eventRepeated] });
              }

              eventsToSort.push(eventRepeated);
            }
          });
        }
      }

      if (!eventsToSort || eventsToSort.length < 1) {
        return [];
      }
      return eventsToSort
        .map((event) => {
          const startDate = new Date(event.startDate);
          const endDate = new Date(event.endDate);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);
          return {
            ...event,
            startDate,
            endDate,
            duration: (endDate - startDate) / (24 * 60 * 60 * 1000),
          };
        })
        .filter(
          (event) =>
            event.startDate <= targetDateObj && event.endDate >= targetDateObj,
        )
        .sort((a, b) => b.duration - a.duration);
    },
    [month, year, eventMap],
  );

  const daysData = useMemo(() => {
    return [...Array(paddingDays + daysInMonth)].map((_, index) => {
      const dayNumber = index - paddingDays + 1;
      const isPaddingDay = index < paddingDays;

      if (isPaddingDay) {
        return {
          index,
          dayNumber,
          dateStr: null,
          isCurrentDate: false,
          eventsToRender: [],
          remindersToRender: [],
          isPaddingDay: true,
        };
      }

      const dateStr = `${month + 1}/${dayNumber}/${year}`;

      const isCurrentDate =
        dayNumber === day &&
        month === dateObj.getMonth() &&
        year === dateObj.getFullYear();

      const eventsToRender = getIndicesForEvents(dateStr);

      return {
        index,
        dayNumber,
        dateStr,
        isCurrentDate,
        eventsToRender,
        isPaddingDay: false,
      };
    });
  }, [
    paddingDays,
    daysInMonth,
    month,
    year,
    day,
    dateObj,
    getIndicesForEvents,
  ]);

  return (
    <motion.div
      variants={calendar}
      initial="hidden"
      animate="show"
      className="grid grid-cols-7 min-h-[50vh] h-[83vh] gap-1"
    >
      {daysData.map(
        ({ index, dayNumber, dateStr, isCurrentDate, eventsToRender }) =>
          React.memo(
            <DayCell
              index={index}
              dayNumber={dayNumber}
              dateStr={dateStr}
              isCurrentDate={isCurrentDate}
              eventsToRender={eventsToRender}
            />,
          ),
      )}
      {/* <ConfirmDates /> */}
    </motion.div>
  );
};

export default MonthView;
