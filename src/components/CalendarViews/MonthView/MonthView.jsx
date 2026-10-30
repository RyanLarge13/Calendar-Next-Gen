import { motion, animate, useMotionValue } from "framer-motion";
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import DatesContext from "../../../context/DatesContext.jsx";
import UserContext from "../../../context/UserContext.jsx";

import {
  cloneEventForDay,
  eventOccursOnDay,
  getEasterDate,
  parseCalendarDate,
} from "../../../utils/helpers.js";
import DayCell from "./DayCell.jsx";

const MonthPanel = React.memo(
  function MonthPanel({
    panelDate,
    todayDay,
    todayMonth,
    todayYear,
    getEvents,
  }) {
    const month = panelDate.getMonth();
    const year = panelDate.getFullYear();
    const paddingDays = panelDate.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = useMemo(
      () =>
        Array.from({ length: paddingDays + daysInMonth }, (_, index) => {
          const dayNumber = index - paddingDays + 1;
          const isPaddingDay = index < paddingDays;
          const dateStr = isPaddingDay
            ? null
            : month + 1 + "/" + dayNumber + "/" + year;
          return {
            index,
            dayNumber,
            dateStr,
            isPaddingDay,
            isCurrentDate:
              !isPaddingDay &&
              dayNumber === todayDay &&
              month === todayMonth &&
              year === todayYear,
            eventsToRender: isPaddingDay ? [] : getEvents(dateStr, month, year),
          };
        }),
      [
        month,
        year,
        paddingDays,
        daysInMonth,
        todayDay,
        todayMonth,
        todayYear,
        getEvents,
      ],
    );
    return (
      <div className="box-border px-1 md:px-5 pt-5 pb-1 w-1/3 min-w-0 h-full min-h-0 overflow-hidden shrink-0">
        <div className="gap-1 grid grid-cols-7 w-full min-w-0 h-full min-h-full">
          {days.map(
            ({
              index,
              dayNumber,
              dateStr,
              isCurrentDate,
              eventsToRender,
              isPaddingDay,
            }) => (
              <DayCell
                key={index}
                index={index}
                dayNumber={dayNumber}
                dateStr={dateStr}
                isCurrentDate={isCurrentDate}
                eventsToRender={eventsToRender}
                month={month}
                year={year}
                dateObj={new Date(todayYear, todayMonth, todayDay)}
                paddingDays={paddingDays}
                isPaddingDay={isPaddingDay}
              />
            ),
          )}
        </div>
      </div>
    );
  },
  (a, b) =>
    a.panelDate.getTime() === b.panelDate.getTime() &&
    a.todayDay === b.todayDay &&
    a.todayMonth === b.todayMonth &&
    a.todayYear === b.todayYear &&
    a.getEvents === b.getEvents,
);

const MonthView = () => {
  const { eventMap } = useContext(UserContext);
  const { dt, setNav, registerMonthNavigation, day, dateObj } =
    useContext(DatesContext);
  const [displayMonth, setDisplayMonth] = useState(
    () => new Date(dt.getFullYear(), dt.getMonth(), 1),
  );
  const viewportRef = useRef(null);
  const widthRef = useRef(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const x = useMotionValue(0);
  const trackOpacity = useMotionValue(1);
  const fastJumpRef = useRef(false);
  const animatingRef = useRef(false);
  const mountedRef = useRef(true);
  const animationRef = useRef(null);
  const displayMonthRef = useRef(displayMonth);
  const targetMonthRef = useRef(displayMonth);
  const committedMonthRef = useRef(new Date(dt.getFullYear(), dt.getMonth(), 1));
  const pendingCommitRef = useRef(false);
  const dragActiveRef = useRef(false);
  const wheelAccumulatorRef = useRef(0);
  const wheelLastTimeRef = useRef(0);
  const wheelCooldownRef = useRef(0);
  const navigationRef = useRef(null);
  const runRef = useRef(null);
  const monthOffset = (date, offset) =>
    new Date(date.getFullYear(), date.getMonth() + offset, 1);
  const monthDistance = (from, to) =>
    (to.getFullYear() - from.getFullYear()) * 12 + to.getMonth() - from.getMonth();

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      animationRef.current?.stop();
      animatingRef.current = false;
    };
  }, []);

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    const update = () => {
      widthRef.current = element.clientWidth;
      setViewportWidth(element.clientWidth);
      if (!animatingRef.current && !dragActiveRef.current)
        x.set(-widthRef.current);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [x]);

  // One owner of the track animation. Navigation requests only update the target.
  runRef.current = () => {
    if (!mountedRef.current || animatingRef.current || pendingCommitRef.current ||
        dragActiveRef.current || !widthRef.current) return;
    const distance = monthDistance(displayMonthRef.current, targetMonthRef.current);
    if (!distance) return;
    const direction = Math.sign(distance);
    const width = widthRef.current;
    animatingRef.current = true;
    // Skip obsolete intermediate months when the user is navigating quickly.
    // Fade out before recycling panels so no visible day cells are replaced mid-slide.
    if (Math.abs(distance) >= 3) {
      fastJumpRef.current = true;
      animationRef.current = animate(trackOpacity, 0, {
        duration: 0.12,
        ease: "easeOut",
        onComplete: () => {
          if (!mountedRef.current) return;
          const destination = targetMonthRef.current;
          const jump = monthDistance(displayMonthRef.current, destination);
          pendingCommitRef.current = true;
          committedMonthRef.current = destination;
          displayMonthRef.current = destination;
          setDisplayMonth(destination);
          setNav((previous) => previous + jump);
        },
      });
      return;
    }
    fastJumpRef.current = false;
    const controls = animate(x, -width * (1 + direction), {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
      onComplete: () => {
        if (!mountedRef.current) return;
        const next = monthOffset(displayMonthRef.current, direction);
        pendingCommitRef.current = true;
        committedMonthRef.current = next;
        displayMonthRef.current = next;
        setDisplayMonth(next);
        setNav((previous) => previous + direction);
      },
    });
    animationRef.current = controls;
  };

  // Reset the strip only AFTER React has committed the recycled month panels.
  // Layout effect avoids displaying the off-center track with newly keyed panels.
  useLayoutEffect(() => {
    if (!pendingCommitRef.current) return;
    x.set(-widthRef.current);
    pendingCommitRef.current = false;
    if (fastJumpRef.current) {
      fastJumpRef.current = false;
      // The destination is now committed and centered; reveal it only afterward.
      animationRef.current = animate(trackOpacity, 1, {
        duration: 0.18,
        ease: "easeOut",
        onComplete: () => {
          animatingRef.current = false;
          animationRef.current = null;
          runRef.current?.();
        },
      });
      return;
    }
    animatingRef.current = false;
    animationRef.current = null;
    const frame = requestAnimationFrame(() => runRef.current?.());
    return () => cancelAnimationFrame(frame);
  }, [displayMonth, x, trackOpacity]);

  navigationRef.current = (delta) => {
    if (!delta || !Number.isFinite(delta)) return;
    // Keep all user inputs, but coalesce them into one destination.
    targetMonthRef.current = monthOffset(targetMonthRef.current, Math.trunc(delta));
    runRef.current?.();
  };

  useEffect(
    () => registerMonthNavigation((delta) => navigationRef.current?.(delta)),
    [registerMonthNavigation],
  );

  // DatePicker/Today changes are absolute jumps, not month-by-month navigation.
  // Internal slides already record their committed date before updating setNav,
  // so their corresponding dt update is ignored here.
  useLayoutEffect(() => {
    const next = new Date(dt.getFullYear(), dt.getMonth(), 1);
    if (next.getTime() === committedMonthRef.current.getTime()) return;
    animationRef.current?.stop();
    animationRef.current = null;
    animatingRef.current = false;
    dragActiveRef.current = false;
    pendingCommitRef.current = false;
    fastJumpRef.current = false;
    wheelAccumulatorRef.current = 0;
    committedMonthRef.current = next;
    targetMonthRef.current = next;
    displayMonthRef.current = next;
    x.set(-widthRef.current);
    trackOpacity.set(1);
    setDisplayMonth(next);
  }, [dt, x, trackOpacity]);

  const finishSwipe = (_, info) => {
    dragActiveRef.current = false;
    if (animatingRef.current || !widthRef.current) return;
    const threshold = widthRef.current * 0.2;
    const delta =
      info.offset.x < -threshold || info.velocity.x < -550
        ? 1
        : info.offset.x > threshold || info.velocity.x > 550
          ? -1
          : 0;
    if (delta) navigationRef.current?.(delta);
    else {
      animatingRef.current = true;
      animationRef.current = animate(x, -widthRef.current, {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        onComplete: () => {
          animatingRef.current = false;
          runRef.current?.();
        },
      });
    }
  };

  const onWheelRef = useRef(null);
  onWheelRef.current = (event) => {
    if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    if (event.target.closest(
      "[data-month-popup], input, textarea, select, [contenteditable=true]"
    )) return;
    event.preventDefault();
    const now = performance.now();
    if (now - wheelLastTimeRef.current > 240) wheelAccumulatorRef.current = 0;
    wheelLastTimeRef.current = now;
    const multiplier = event.deltaMode === 1 ? 16 :
      event.deltaMode === 2 ? window.innerHeight : 1;
    wheelAccumulatorRef.current += event.deltaY * multiplier;
    if (Math.abs(wheelAccumulatorRef.current) < 90 ||
        now < wheelCooldownRef.current) return;
    const direction = Math.sign(wheelAccumulatorRef.current);
    wheelAccumulatorRef.current = 0;
    wheelCooldownRef.current = now + 250;
    navigationRef.current?.(direction);
  };

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    const handleWheel = (event) => onWheelRef.current?.(event);
    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => element.removeEventListener("wheel", handleWheel);
  }, []);

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
        const occurs =
          event?.repeats?.kind && event?.repeats?.rules
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
    return (
      <MonthPanel
        key={panelDate.getFullYear() + "-" + panelDate.getMonth()}
        panelDate={panelDate}
        todayDay={day}
        todayMonth={dateObj.getMonth()}
        todayYear={dateObj.getFullYear()}
        getEvents={getIndicesForEvents}
      />
    );
  });

  return (
    <motion.div
      ref={viewportRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22 }}
      className="w-full h-full min-h-0 overflow-hidden"
    >
      <motion.div
        className="flex w-[300%] h-full touch-pan-y will-change-transform"
        style={{ x, opacity: trackOpacity }}
        drag="x"
        onDragStart={() => { dragActiveRef.current = !animatingRef.current; }}
        dragMomentum={false}
        dragTransition={{ power: 0, timeConstant: 260 }}
        onDrag={(_, info) => {
          // Subtle resistance: offset the gesture by 3% without changing swipe detection.
          const center = -widthRef.current;
          if (!dragActiveRef.current || animatingRef.current) return;
          x.set(Math.max(-2 * widthRef.current, Math.min(0, center + info.offset.x * 0.99)));
        }}
        dragElastic={0.2}
        dragConstraints={{ left: -2 * viewportWidth, right: 0 }}
        onDragEnd={finishSwipe}
      >
        {panels}
      </motion.div>
    </motion.div>
  );
};

export default MonthView;
