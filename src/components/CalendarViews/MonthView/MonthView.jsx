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

const MonthPanel = React.memo(function MonthPanel({ panelDate, todayDay, todayMonth, todayYear, getEvents }) {
  const month = panelDate.getMonth();
  const year = panelDate.getFullYear();
  const paddingDays = panelDate.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = useMemo(() => Array.from({ length: paddingDays + daysInMonth }, (_, index) => {
    const dayNumber = index - paddingDays + 1;
    const isPaddingDay = index < paddingDays;
    const dateStr = isPaddingDay ? null : (month + 1) + "/" + dayNumber + "/" + year;
    return { index, dayNumber, dateStr, isPaddingDay,
      isCurrentDate: !isPaddingDay && dayNumber === todayDay && month === todayMonth && year === todayYear,
      eventsToRender: isPaddingDay ? [] : getEvents(dateStr, month, year) };
  }), [month, year, paddingDays, daysInMonth, todayDay, todayMonth, todayYear, getEvents]);
  return <div className="w-1/3 shrink-0 min-w-0 h-full min-h-0 overflow-hidden p-5 box-border">
    <div className="w-full h-full min-h-0 min-w-0 grid grid-cols-7 grid-rows-6 gap-1">
      {days.map(({ index, dayNumber, dateStr, isCurrentDate, eventsToRender, isPaddingDay }) => (
        <DayCell key={index} index={index} dayNumber={dayNumber} dateStr={dateStr}
          isCurrentDate={isCurrentDate} eventsToRender={eventsToRender} month={month}
          year={year} dateObj={new Date(todayYear, todayMonth, todayDay)} paddingDays={paddingDays} isPaddingDay={isPaddingDay} />
      ))}
    </div>
  </div>;
}, (a, b) => a.panelDate.getTime() === b.panelDate.getTime() &&
  a.todayDay === b.todayDay && a.todayMonth === b.todayMonth &&
  a.todayYear === b.todayYear && a.getEvents === b.getEvents);

const MonthView = () => {
  const { eventMap } = useContext(UserContext);
  const { dt, setNav, registerMonthNavigation, day, dateObj } = useContext(DatesContext);
  const [displayMonth, setDisplayMonth] = useState(() => new Date(dt.getFullYear(), dt.getMonth(), 1));
  const viewportRef = useRef(null);
  const widthRef = useRef(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const x = useMotionValue(0);
  const animatingRef = useRef(false);
  const wheelAccumulatorRef = useRef(0);
  const wheelLastTimeRef = useRef(0);
  const wheelCooldownRef = useRef(0);
  const pendingNavigationRef = useRef(null);
  const desiredMonthRef = useRef(new Date(dt.getFullYear(), dt.getMonth(), 1));
  desiredMonthRef.current = new Date(dt.getFullYear(), dt.getMonth(), 1);
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

  // The header changes DatesContext before the slide begins. Animate the already
  // rendered adjacent panel, then recycle it only after the slide completes.
  useEffect(() => {
    const next = new Date(dt.getFullYear(), dt.getMonth(), 1);
    if (pendingNavigationRef.current === next.getTime()) {
      pendingNavigationRef.current = null;
      return;
    }
    if (next.getTime() === displayMonth.getTime()) return;
    if (animatingRef.current) return;
    const delta = (next.getFullYear() - displayMonth.getFullYear()) * 12 + next.getMonth() - displayMonth.getMonth();
    if (Math.abs(delta) !== 1 || !widthRef.current) {
      setDisplayMonth(next);
      x.set(-widthRef.current);
      return;
    }
    animatingRef.current = true;
    const controls = animate(x, -widthRef.current * (1 + delta), {
      duration: 0.28, ease: [0.22, 1, 0.36, 1],
      onComplete: () => {
        pendingNavigationRef.current = next.getTime();
        setDisplayMonth(next);
        x.set(-widthRef.current);
        animatingRef.current = false;
        const desired = desiredMonthRef.current;
        if (desired.getTime() !== next.getTime()) {
          // Catch rapid header clicks after the current transition settles.
          const distance = (desired.getFullYear() - next.getFullYear()) * 12 + desired.getMonth() - next.getMonth();
          if (Math.abs(distance) > 1) {
            setDisplayMonth(desired);
          }
        }
      }
    });
    return () => controls.stop();
  }, [dt, x]);

  // Header and drag both complete the visual transition before committing nav.
  const navigateRef = useRef(null);
  navigateRef.current = async (delta) => {
    if (animatingRef.current || !widthRef.current || !delta) return;
    animatingRef.current = true;
    const width = widthRef.current;
    await animate(x, -width * (1 + delta), {
      duration: 0.24, ease: [0.22, 1, 0.36, 1]
    });
    const next = monthOffset(displayMonth, delta);
    pendingNavigationRef.current = next.getTime();
    setDisplayMonth(next);
    x.set(-widthRef.current);
    animatingRef.current = false;
    setNav((previous) => previous + delta);
  };

  useEffect(() => registerMonthNavigation((delta) => navigateRef.current?.(delta)), [registerMonthNavigation]);

  const finishSwipe = async (_, info) => {
    if (animatingRef.current || !widthRef.current) return;
    const threshold = widthRef.current * 0.2;
    const delta = info.offset.x < -threshold || info.velocity.x < -550 ? 1 :
      info.offset.x > threshold || info.velocity.x > 550 ? -1 : 0;
    if (delta) await navigateRef.current(delta);
    else {
      animatingRef.current = true;
      await animate(x, -widthRef.current, {
        duration: 0.24, ease: [0.22, 1, 0.36, 1]
      });
      animatingRef.current = false;
    }
  };

  const onWheel = (event) => {
    // Leave trackpad horizontal swipes, pinch zoom, and nested scrolling alone.
    if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    if (event.target.closest("[data-month-popup], input, textarea, select, [contenteditable=true]")) return;
    event.preventDefault();
    const now = performance.now();
    if (now - wheelLastTimeRef.current > 240) wheelAccumulatorRef.current = 0;
    wheelLastTimeRef.current = now;
    if (animatingRef.current || now < wheelCooldownRef.current) return;
    const multiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
    wheelAccumulatorRef.current += event.deltaY * multiplier;
    const magnitude = Math.abs(wheelAccumulatorRef.current);
    // Small wheel gestures require more input; strong scrolls cross sooner.
    const threshold = 90;
    if (magnitude < threshold) return;
    const direction = wheelAccumulatorRef.current > 0 ? 1 : -1;
    wheelAccumulatorRef.current = 0;
    wheelCooldownRef.current = now + 420;
    navigateRef.current?.(direction);
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

  const panels = [-1, 0, 1].map((offset) => {
    const panelDate = monthOffset(displayMonth, offset);
    return <MonthPanel key={panelDate.getFullYear() + "-" + panelDate.getMonth()}
      panelDate={panelDate} todayDay={day} todayMonth={dateObj.getMonth()}
      todayYear={dateObj.getFullYear()} getEvents={getIndicesForEvents} />;
  });

  return (
    <motion.div ref={viewportRef} onWheel={onWheel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.22 }} className="w-full h-full min-h-0 overflow-hidden">
      <motion.div
        className="flex w-[300%] h-full touch-pan-y will-change-transform"
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
