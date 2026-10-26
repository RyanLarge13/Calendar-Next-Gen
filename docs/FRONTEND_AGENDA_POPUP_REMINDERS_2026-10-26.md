# Frontend iteration: popup, agenda, reminder priority

## Implemented
- Desktop month hover popup is hidden below the `md` breakpoint, has a 400px width cap and uses clamped viewport positioning with a 12px edge margin.
- AgendaView rebuilt as a responsive 7/14/30-day forward timeline with event cards, counts, and event-detail interaction.
- Reminder menu now pins incomplete, unpaused, valid-dated reminders due within 24 hours (including overdue) above the regular grouped reminders, without duplicates.

## Deferred from the five-item request
- Offline signup/login: the existing username/password form posts to the server and UserContext clears a user without an auth token. Merely writing a user object into IndexedDB would not make the app genuinely logged in, and saving a password in plain IndexedDB would be unsafe. Requires a deliberately separate local-profile state and an offline-aware authentication/rehydration path.
- Multi-day selection in MonthView: DayCell currently owns its own selected array, so selected dates do not persist across cells. The event form also needs a confirmed way to consume start/end range defaults. A shared MonthView selection model and event form prefill should be built together to avoid creating events on the wrong dates.

## Manual tests
1. Hover on dates at all desktop viewport edges and confirm popup stays visible. Verify no popup on mobile.
2. Open Agenda and switch 7/14/30 days; inspect multi-day events and event detail navigation.
3. Confirm overdue and next-24-hour reminders appear above user-defined grouping and are not duplicated.

No build or browser tests performed through GitHub.
