# SSE notification lifecycle — frontend

`UserContext.jsx` now stores the active `EventSource` in refs and reuses it when the same user triggers notification initialization repeatedly. It closes the connection when the user logs out, changes, or the provider unmounts. It does not close/recreate streams on transient errors; native `EventSource` handles reconnection. The old 15-second manual retry timers and per-connection `beforeunload` handlers were removed.

Notifications arriving through SSE are deduplicated by ID in both notification collections. History fetches merge with live messages instead of replacing them, and outdated history responses are ignored.

`src/utils/api.js` retains the existing EventSource URL and authentication behavior. Authentication migration is deferred by request.

## Manual tests
- Log in and verify only one EventSource request per tab.
- Trigger repeated subscription refreshes; ensure no duplicate streams.
- Simulate offline/online transitions; expect native reconnection and no accumulating timers.
- Open two tabs; close one and confirm the other continues receiving messages.
- Log out and confirm the stream closes.
- Verify no duplicate notification UI entries after reconnection.
