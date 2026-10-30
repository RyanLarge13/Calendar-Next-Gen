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
  const { dt, updatedDate, nav, setNav, registerMonthNavigation, day, dateObj } =
    useContext(DatesContext);
  const [displayMonth, setDisplayMonth] = useState(
    () => new Date(dt.getFullYear(), dt.getMonth(), 1),
  );
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const widthRef = useRef(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const mountedRef = useRef(false);
  const stateRef = useRef("idle"); // idle | dragging | animating | committing
  const animationRef = useRef(null);
  const animationTokenRef = useRef(0);
  const pointerRef = useRef(null);
  const displayedRef = useRef(displayMonth);
  const targetRef = useRef(displayMonth);
  const lastDatePickerRef = useRef(updatedDate);
  const pendingDeltaRef = useRef(0);
  const activeDirectionRef = useRef(0);
  const lastInputTimeRef = useRef(0);
  const lastIntervalRef = useRef(350);
  const wheelSumRef = useRef(0);
  const wheelTimeRef = useRef(0);
  const wheelCooldownRef = useRef(0);
  const commitRef = useRef(false);
  const runRef = useRef(null);
  const requestRef = useRef(null);
  const transformRef = useRef(0);

  const monthOffset = (date, offset) =>
    new Date(date.getFullYear(), date.getMonth() + offset, 1);
  const monthDistance = (from, to) =>
    (to.getFullYear() - from.getFullYear()) * 12 + to.getMonth() - from.getMonth();

  const setPosition = (position) => {
    transformRef.current = position;
    if (trackRef.current)
      trackRef.current.style.transform = `translate3d(${position}px, 0, 0)`;
  };

  const stopAnimation = () => {
    animationTokenRef.current += 1;
    animationRef.current?.cancel();
    animationRef.current = null;
  };

  // WAAPI is the sole animation owner. Dragging only writes the transform
  // while no animation is active. A token invalidates canceled callbacks.
  const animateTo = (destination, duration, onDone) => {
    const element = trackRef.current;
    if (!element) return;
    stopAnimation();
    const token = animationTokenRef.current;
    const start = transformRef.current;
    const animation = element.animate(
      [
        { transform: `translate3d(${start}px, 0, 0)` },
        { transform: `translate3d(${destination}px, 0, 0)` },
      ],
      { duration, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" },
    );
    animationRef.current = animation;
    animation.onfinish = () => {
      if (!mountedRef.current || token !== animationTokenRef.current) return;
      // Set the underlying transform before removing the animation effect.
      setPosition(destination);
      animation.cancel();
      animationRef.current = null;
      onDone();
    };
  };

  const commitMonth = (month) => {
    stateRef.current = "committing";
    displayedRef.current = month;
    commitRef.current = true;
    setDisplayMonth(month);
  };

  runRef.current = () => {
    if (!mountedRef.current || stateRef.current !== "idle" || !widthRef.current) return;
    const distance = monthDistance(displayedRef.current, targetRef.current);
    if (!distance) return;
    const direction = Math.sign(distance);
    activeDirectionRef.current = direction;
    stateRef.current = "animating";
    const width = widthRef.current;

    // A burst is one destination, not a long series of intermediate slides.
    if (Math.abs(distance) >= 3) {
      stopAnimation();
      const token = animationTokenRef.current;
      const fade = trackRef.current.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: 90, fill: "forwards" },
      );
      animationRef.current = fade;
      fade.onfinish = () => {
        if (!mountedRef.current || token !== animationTokenRef.current) return;
        trackRef.current.style.opacity = "0";
        fade.cancel();
        animationRef.current = null;
        commitMonth(targetRef.current);
      };
      return;
    }

    const duration = Math.max(110, Math.min(280, 115 + lastIntervalRef.current * 0.28));
    animateTo(-width * (1 + direction), duration, () => {
      commitMonth(monthOffset(displayedRef.current, direction));
    });
  };

  requestRef.current = (delta, source = "header") => {
    if (!Number.isFinite(delta) || !Math.trunc(delta)) return;
    const steps = Math.trunc(delta);
    const now = performance.now();
    const interval = now - lastInputTimeRef.current;
    if (lastInputTimeRef.current && interval < 900)
      lastIntervalRef.current = interval;
    else lastIntervalRef.current = 350;
    lastInputTimeRef.current = now;
    targetRef.current = monthOffset(targetRef.current, steps);
    pendingDeltaRef.current = monthDistance(displayedRef.current, targetRef.current);
    // Header/date state updates at request time, never on animation completion.
    setNav((previous) => previous + steps);
    if (stateRef.current === "idle") runRef.current?.();
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopAnimation();
    };
  }, []);

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    const resize = () => {
      const width = element.clientWidth;
      widthRef.current = width;
      setViewportWidth(width);
      if (stateRef.current === "idle") setPosition(-width);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Recycle panels and reset the track in a layout effect, before paint.
  useLayoutEffect(() => {
    if (!commitRef.current) return;
    commitRef.current = false;
    setPosition(-widthRef.current);
    pendingDeltaRef.current = monthDistance(displayedRef.current, targetRef.current);
    if (trackRef.current?.style.opacity === "0") {
      const element = trackRef.current;
      element.style.opacity = "1";
      const fade = element.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 120, easing: "ease-out",
      });
      stateRef.current = "animating";
      animationRef.current = fade;
      const token = animationTokenRef.current;
      fade.onfinish = () => {
        if (!mountedRef.current || token !== animationTokenRef.current) return;
        animationRef.current = null;
        stateRef.current = "idle";
        runRef.current?.();
      };
      return;
    }
    stateRef.current = "idle";
    const frame = requestAnimationFrame(() => runRef.current?.());
    return () => cancelAnimationFrame(frame);
  }, [displayMonth]);

  useEffect(
    () => registerMonthNavigation((delta) => requestRef.current?.(delta, "header")),
    [registerMonthNavigation],
  );

  // DatePicker is an absolute jump: cancel animation, clear pending input,
  // replace all three panels immediately, and recenter without a transition.
  useLayoutEffect(() => {
    if (lastDatePickerRef.current === updatedDate) return;
    lastDatePickerRef.current = updatedDate;
    stopAnimation();
    pointerRef.current = null;
    stateRef.current = "idle";
    commitRef.current = false;
    pendingDeltaRef.current = 0;
    wheelSumRef.current = 0;
    // DatesContext derives dt in an effect; updatedDate can arrive one render earlier.
    const destination = new Date(updatedDate.getFullYear(), updatedDate.getMonth() + nav, 1);
    displayedRef.current = destination;
    targetRef.current = destination;
    if (trackRef.current) trackRef.current.style.opacity = "1";
    setPosition(-widthRef.current);
    setDisplayMonth(destination);
  }, [updatedDate]);

  const onPointerDown = (event) => {
    if (stateRef.current !== "idle" || !widthRef.current ||
        (event.pointerType === "mouse" && event.button !== 0) ||
        event.target.closest("button, input, textarea, select, a, [contenteditable=true], [data-month-popup]"))
      return;
    pointerRef.current = {
      id: event.pointerId, x: event.clientX, y: event.clientY,
      start: performance.now(), lastX: event.clientX, lastTime: performance.now(),
      velocity: 0, horizontal: false,
    };
  };

  const onPointerMove = (event) => {
    const gesture = pointerRef.current;
    if (!gesture || gesture.id !== event.pointerId) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    if (!gesture.horizontal) {
      if (Math.abs(dx) < 9 && Math.abs(dy) < 9) return;
      if (Math.abs(dy) > Math.abs(dx)) { pointerRef.current = null; return; }
      if (stateRef.current !== "idle") { pointerRef.current = null; return; }
      gesture.horizontal = true;
      stateRef.current = "dragging";
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    const now = performance.now();
    const elapsed = now - gesture.lastTime;
    if (elapsed > 0) gesture.velocity = (event.clientX - gesture.lastX) / elapsed;
    gesture.lastX = event.clientX;
    gesture.lastTime = now;
    const width = widthRef.current;
    const offset = Math.max(-width, Math.min(width, dx));
    setPosition(-width + offset);
  };

  const onPointerEnd = (event) => {
    const gesture = pointerRef.current;
    if (!gesture || gesture.id !== event.pointerId) return;
    pointerRef.current = null;
    if (!gesture.horizontal || stateRef.current !== "dragging") return;
    const width = widthRef.current;
    const offset = transformRef.current + width;
    const velocity = gesture.velocity * 1000;
    const direction = offset < -width * 0.2 || velocity < -550 ? 1 :
      offset > width * 0.2 || velocity > 550 ? -1 : 0;
    stateRef.current = "animating";
    const destination = direction ? -width * (1 + direction) : -width;
    const remaining = Math.abs(destination - transformRef.current);
    const duration = Math.max(75, Math.min(260,
      remaining / Math.max(500, Math.abs(velocity)) * 1000));
    if (direction) {
      // Record the swipe immediately; don't start a second animation.
      targetRef.current = monthOffset(targetRef.current, direction);
      pendingDeltaRef.current = monthDistance(displayedRef.current, targetRef.current);
      setNav((previous) => previous + direction);
    }
    animateTo(destination, duration, () => {
      if (direction) commitMonth(monthOffset(displayedRef.current, direction));
      else {
        stateRef.current = "idle";
        runRef.current?.();
      }
    });
  };

  const onWheelRef = useRef(null);
  onWheelRef.current = (event) => {
    if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    if (event.target.closest(
      "[data-month-popup], input, textarea, select, [contenteditable=true]"
    )) return;
    event.preventDefault();
    const now = performance.now();
    if (now - wheelTimeRef.current > 240) wheelSumRef.current = 0;
    wheelTimeRef.current = now;
    const multiplier = event.deltaMode === 1 ? 16 :
      event.deltaMode === 2 ? window.innerHeight : 1;
    wheelSumRef.current += event.deltaY * multiplier;
    if (Math.abs(wheelSumRef.current) < 90 || now < wheelCooldownRef.current) return;
    const direction = Math.sign(wheelSumRef.current);
    wheelSumRef.current = 0;
    wheelCooldownRef.current = now + 180;
    requestRef.current?.(direction, "wheel");
  };
  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    const handler = (event) => onWheelRef.current?.(event);
    element.addEventListener("wheel", handler, { passive: false });
    return () => element.removeEventListener("wheel", handler);
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
    <div
      ref={viewportRef}
      className="w-full h-full min-h-0 overflow-hidden"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
    >
      <div
        ref={trackRef}
        className="flex w-[300%] h-full touch-pan-y will-change-transform"
        style={{ transform: `translate3d(-${viewportWidth}px, 0, 0)` }}
      >
        {panels}
      </div>
    </div>
  );
};

export default MonthView;
