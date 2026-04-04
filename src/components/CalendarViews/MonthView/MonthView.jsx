import { motion } from "framer-motion";
import React, { useCallback, useContext, useMemo, useRef } from "react";
import DatesContext from "../../../context/DatesContext.jsx";
import UserContext from "../../../context/UserContext.jsx";
import { calendar } from "../../../motion.js";
import {
  cloneEventForDay,
  eventOccursOnDay,
  getEasterDate,
  parseCalendarDate,
} from "../../../utils/helpers.js";
import DayCell from "./DayCell.jsx";

const MonthView = () => {
  const { eventMap } = useContext(UserContext);
  const { paddingDays, daysInMonth, month, year, day, dateObj } =
    useContext(DatesContext);

  const cloneMap = useRef(new Map());

  const handleFloatRepeat = (e, targetDate) => {
    const kind = e?.repeats?.kind;
    const rules = e?.repeats?.rules;

    if (!kind || !rules) return false;

    if (Number.isNaN(targetDate.getTime())) return false;

    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    const day = targetDate.getDate();

    switch (kind) {
      case "relative_to_easter": {
        const { offset = 0 } = rules;

        const easter = getEasterDate(year);
        easter.setHours(0, 0, 0, 0);

        const targetEasterRelativeDate = new Date(easter);
        targetEasterRelativeDate.setDate(
          targetEasterRelativeDate.getDate() + offset,
        );

        return (
          targetDate.getFullYear() === targetEasterRelativeDate.getFullYear() &&
          targetDate.getMonth() === targetEasterRelativeDate.getMonth() &&
          targetDate.getDate() === targetEasterRelativeDate.getDate()
        );
      }
      case "nth_weekday": {
        const { month: ruleMonth, weekday, nth } = rules;
        if (
          ruleMonth == null ||
          weekday == null ||
          nth == null ||
          month !== ruleMonth ||
          targetDate.getDay() !== weekday
        ) {
          return false;
        }

        const firstOfMonth = new Date(year, ruleMonth, 1);
        const firstDayWeekday = firstOfMonth.getDay();
        const offset = (weekday - firstDayWeekday + 7) % 7;
        const firstMatchingDay = 1 + offset;
        const targetNthDay = firstMatchingDay + (nth - 1) * 7;

        return day === targetNthDay;
      }

      case "last_weekday": {
        const { month: ruleMonth, weekday } = rules;
        if (
          ruleMonth == null ||
          weekday == null ||
          month !== ruleMonth ||
          targetDate.getDay() !== weekday
        ) {
          return false;
        }

        const lastOfMonth = new Date(year, ruleMonth + 1, 0);
        const lastDayWeekday = lastOfMonth.getDay();
        const offset = (lastDayWeekday - weekday + 7) % 7;
        const lastMatchingDay = lastOfMonth.getDate() - offset;

        return day === lastMatchingDay;
      }

      case "special_first_tuesday_after_first_monday": {
        const { month: ruleMonth } = rules;
        if (
          ruleMonth == null ||
          month !== ruleMonth ||
          targetDate.getDay() !== 2
        ) {
          return false;
        }

        const firstOfMonth = new Date(year, ruleMonth, 1);
        const firstDayWeekday = firstOfMonth.getDay();
        const firstMondayOffset = (1 - firstDayWeekday + 7) % 7;
        const firstMonday = 1 + firstMondayOffset;
        const firstTuesdayAfterFirstMonday = firstMonday + 1;

        return day === firstTuesdayAfterFirstMonday;
      }

      default:
        return false;
    }
  };

  const getIndicesForEvents = useCallback(
    (dtStr) => {
      const targetDateObj = parseCalendarDate(dtStr);
      // const targetDateObj = new Date(dtStr);
      const key = `${year}-${month}`;
      const baseEvents = eventMap.get(key)?.events || [];
      const eventsToSort = [...baseEvents];
      const repeatEvents = eventMap.get("repeat-events")?.events || [];

      const cloneKey = `${year}-${month}-${dtStr}`;

      if (cloneMap.current.has(cloneKey)) {
        const eventClones = cloneMap.current.get(cloneKey).events;
        eventsToSort.push(...eventClones);
      } else {
        if (repeatEvents.length > 0) {
          repeatEvents.forEach((e) => {
            let eLandsOnDay = false;

            if (e.repeats.kind && e.repeats.rules) {
              eLandsOnDay = handleFloatRepeat(e, targetDateObj);
            } else {
              eLandsOnDay = eventOccursOnDay(e, targetDateObj);
            }
            if (eLandsOnDay) {
              const eventRepeated = cloneEventForDay(e, targetDateObj);

              if (cloneMap.current.has(cloneKey)) {
                cloneMap.current.get(cloneKey).events.push(eventRepeated);
              } else {
                cloneMap.current.set(cloneKey, { events: [eventRepeated] });
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
        ({ index, dayNumber, dateStr, isCurrentDate, eventsToRender }) => (
          <DayCell
            key={index}
            index={index}
            dayNumber={dayNumber}
            dateStr={dateStr}
            isCurrentDate={isCurrentDate}
            eventsToRender={eventsToRender}
            month={month}
            year={year}
            dateObj={dateObj}
          />
        ),
      )}
      {/* <ConfirmDates /> */}
    </motion.div>
  );
};

export default MonthView;
