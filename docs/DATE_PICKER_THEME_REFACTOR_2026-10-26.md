# Date picker and theme refactor — October 26, 2026

Branch: `dev`. This is a first-pass source-level fix and style foundation, **not a verified end-to-end UI test**.

## What changed

- `src/components/CalendarViews/Calendar.jsx`: connect missing date/event context setters; prioritize event end-date selection when an event is being added, including in day view. Previously the callback could update the viewed day rather than the event end date.
- `src/components/DatePickers/FullDatePicker.jsx`: consistently represent days as 1–31, adjust wheel scrolling/index bounds, recalculate day counts when month/year change, construct dates in a single constructor call, close on confirmation, and render picker in a document-body portal.
- `src/components/DatePickers/DatePicker.jsx`: render the picker in a document-body portal and adopt the shared gold action style.
- `src/components/Modal/ModalHeader.jsx`: use the shared gold accent for the secondary date.
- `src/index.css`: add `--calendar-*` theme tokens and reusable `.calendar-surface`, `.calendar-action`, `.calendar-accent` classes. Existing dark-mode styles remain in place; broad component migration is future work.

## Manual verification checklist

1. On `dev`, open add-event from **month view**, choose Add End Date, change day/month/year and press Okay. Confirm the displayed end date changes.
2. Repeat from **day view**; the selection must update the end date, not navigate away.
3. Check 28/29/30/31-day months, leap years, December-to-January, and the first/last days of months.
4. Tap arrows and scroll the wheels; confirm the preview matches the saved date.
5. Tap Cancel, close icon, and backdrop; confirm no date is applied.
6. Check the month/year picker from the header, including on mobile.
7. Verify picker/backdrop layering above the modal and touch interactions.
8. Review white/gold controls in light mode and existing dark mode.

## Known limitations and follow-up

- These changes were committed through the GitHub connector; **no build, automated tests, or browser interaction was run**.
- Date picker state still depends on global contexts. A future refactor should pass explicit `value` and `onChange` props so the same component can safely serve multiple use cases.
- Styling tokens are introduced but most app components still use local Tailwind classes and conditional colors. A gradual migration is safer than claiming the entire app has been restyled.
- Consider replacing scroll-wheel timeouts with refs and cleanup on unmount.
