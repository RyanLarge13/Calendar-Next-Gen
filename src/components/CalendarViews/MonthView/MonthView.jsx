import { motion, animate, useMotionValue } from "framer-motion";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import DatesContext from "../../../context/DatesContext.jsx";
import UserContext from "../../../context/UserContext.jsx";

import {
  cloneEventForDay,
  eventOccursOnDay,
  getEasterDate,
  parseCalendarDate,
} from "../../../utils/helpers.js";
import DayCell from "./DayCell.jsx";

const MonthView = () => {
  const { eventMap } = useContext(UserContext);
  const { dt, setNav, day, dateObj } = useContext(DatesContext);
  const [displayMonth, setDisplayMonth] = useState(() => new Date(dt.getFullYear(), dt.getMonth(), 1));
  const viewportRef = useRef(null);
  const widthRef = useRef(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const x = useMotionValue(0);
  const animatingRef = useRef(false);
  const pendingNavigationRef = useRef(null);
  const monthOffset = (date, offset) => new Date(date.getFullYear(), date.getMonth() + offset, 1);

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    const update = () => {
      widthRef.current = element.clientWidth;
      setViewportWidth(element.clientWidth);
      if (!animatingRef.current) x.set(-widthRef.current);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [x]);

  useEffect(() => {
    const next = new Date(dt.getFullYear(), dt.getMonth(), 1);
    if (pendingNavigationRef.current !== null) {
      if (pendingNavigationRef.current === next.getTime()) pendingNavigationRef.current = null;
      return;
    }
    if (next.getTime() === displayMonth.getTime()) return;
    const delta = (next.getFullYear() - displayMonth.getFullYear()) * 12 + next.getMonth() - displayMonth.getMonth();
    if (Math.abs(delta) !== 1 || !widthRef.current) {
      setDisplayMonth(next);
      x.set(-widthRef.current);
      animatingRef.current = false;
      return;
    }
    animatingRef.current = true;
    const animation = animate(x, -widthRef.current * (1 + delta), {
      duration: 0.28, ease: [0.22, 1, 0.36, 1],
      onComplete: () => {
        setDisplayMonth(next);
        x.set(-widthRef.current);
        animatingRef.current = false;
      }
    });
    return () => animation.stop();
  }, [dt, displayMonth, x]);

  const finishSwipe = async (_, info) => {
    if (animatingRef.current || !widthRef.current) return;
    const threshold = widthRef.current * 0.2;
    const delta = info.offset.x < -threshold || info.velocity.x < -550 ? 1 : info.offset.x > threshold || info.velocity.x > 550 ? -1 : 0;
    animatingRef.current = true;
    await animate(x, -widthRef.current * (1 + delta), { duration: 0.24, ease: [0.22, 1, 0.36, 1] });
    if (delta) {
      const next = monthOffset(displayMonth, delta);
      pendingNavigationRef.current = next.getTime();
      setDisplayMonth(next);
      x.set(-widthRef.current);
      animatingRef.current = false;
      setNav((previous) => previous + delta);
    } else { x.set(-widthRef.current); animatingRef.current = false; }
  };


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
    (dtStr, month, year) => {
      const targetDateObj = parseCalendarDate(dtStr);
      // const targetDateObj = new Date(dtStr);
      const key = `${year}-${month}`;
      const baseEvents = eventMap.get(key)?.events || [];
      const eventsToSort = [...baseEvents];
      const repeatEvents = eventMap.get("repeat-events")?.events || [];

      // Derive repeating instances from current eventMap so edits cannot leave stale clones.
      for (const event of repeatEvents) {
        const occurs = event?.repeats?.kind && event?.repeats?.rules
          ? handleFloatRepeat(event, targetDateObj)
          : eventOccursOnDay(event, targetDateObj);
        if (occurs) eventsToSort.push(cloneEventForDay(event, targetDateObj));
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
    [eventMap],
  );

  const panels = useMemo(() => [-1, 0, 1].map((offset) => {
    const panelDate = monthOffset(displayMonth, offset);
    const month = panelDate.getMonth();
    const year = panelDate.getFullYear();
    const paddingDays = panelDate.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = Array.from({ length: paddingDays + daysInMonth }, (_, index) => {
      const dayNumber = index - paddingDays + 1;
      const isPaddingDay = index < paddingDays;
      const dateStr = isPaddingDay ? null : (month + 1) + "/" + dayNumber + "/" + year;
      return { index, dayNumber, dateStr, isPaddingDay,
        isCurrentDate: !isPaddingDay && dayNumber === day && month === dateObj.getMonth() && year === dateObj.getFullYear(),
        eventsToRender: isPaddingDay ? [] : getIndicesForEvents(dateStr, month, year) };
    });
    return <div key={year + "-" + month} className="w-1/3 shrink-0 min-w-0 h-[83vh] overflow-hidden grid grid-cols-7 grid-rows-6 auto-rows-fr gap-1">
      {days.map(({ index, dayNumber, dateStr, isCurrentDate, eventsToRender, isPaddingDay }) => (
        <DayCell key={index} index={index} dayNumber={dayNumber} dateStr={dateStr}
          isCurrentDate={isCurrentDate} eventsToRender={eventsToRender} month={month}
          year={year} dateObj={dateObj} paddingDays={paddingDays} isPaddingDay={isPaddingDay} />
      ))}
    </div>;
  }), [displayMonth, day, dateObj, getIndicesForEvents]);

  return (
    <motion.div ref={viewportRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.22 }} className="w-full overflow-hidden">
      <motion.div
        className="flex w-[300%] touch-pan-y will-change-transform"
        style={{ x }}
        drag="x"
        dragMomentum={false}
        dragElastic={0.08}
        dragConstraints={{ left: -2 * viewportWidth, right: 0 }}
        onDragEnd={finishSwipe}
      >
        {panels}
      </motion.div>
    </motion.div>
  );
};

export default MonthView;
