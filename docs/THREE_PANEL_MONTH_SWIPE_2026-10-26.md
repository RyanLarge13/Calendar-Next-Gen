# Three-panel MonthView swipe prototype

Frontend-only implementation on dev. MonthView renders previous/current/next month panels side by side and translates the full track as the user drags. It retains a one-time initial fade but no longer staggers individual day cells during month navigation.

## Changes
- MonthView computes each panel's own year, month, day padding, and events; DayCell receives its own panel padding and ignores padding-cell interactions.
- The existing DatesContext `setNav` remains the source of truth for committed navigation; the global Calendar wrapper no longer handles month dragging.
- MonthView measures its viewport with ResizeObserver and uses that width for drag bounds, snapping, and recentering.
- Adjacent months render in advance; after a committed navigation, the three panels are recalculated around the new active month.
- Repeat-event clones are computed from current eventMap rather than a persistent cache.

## Manual tests
1. Swipe slowly left/right on a phone; verify partial adjacent-month preview and correct snap/cancel behavior.
2. Test repeated swipes, December/January boundaries, narrow and rotated mobile viewports.
3. Navigate using the header arrows and date picker; confirm smooth transitions and correct month heading.
4. Verify events, repeating events, day clicks, context menu, and event creation on adjacent panels after navigating.
5. Verify Day/Week/Agenda/Masonry views still function and do not drag sideways.
6. Test scroll versus horizontal swipe and check console for runtime errors.

## Known limitations
- This is a first browser-test prototype, not a verified production implementation.
- There is no background network fetch; adjacent panels are pre-rendered from existing eventMap data. If future months are fetched lazily, prefetching belongs in the data layer.
- No build, browser or device test was run via the GitHub connector.
