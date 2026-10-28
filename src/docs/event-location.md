# Event location updates (frontend)

`Event.jsx` now waits for a successful location PATCH before updating the selected event, the local display state, and **every** matching event bucket (including recurrence). Previously it used the calendar's selected date to choose a bucket, which could miss the edited event. The Google Maps destination link uses the current saved location and URL encoding.

`src/utils/api.js` sends the complete location object, preserving optional Google Places metadata. The backend returns the normalized saved value. Removing a location uses an empty string and null coordinates.

Manual verification: add a location to an event with none, replace an existing location, remove it, reopen and reload the event, then repeat while the selected calendar date differs from the event's date. Check that the Google map and navigation link reflect the saved place. API errors currently log to the console; no in-app failure toast is provided. Browser/build tests have not been run.
