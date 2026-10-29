# Event location update API

`PATCH /update/event/location` accepts `{ eventId, location }` with a Google Places location object containing `string`, `coordinates: {lat,lng}`, and optional `id`, `city`, `state`. The former `newLocation` and `newCoords` fields remain accepted for older clients.

The endpoint validates authentication, event ID and coordinates, and scopes updates to the authenticated event owner via `updateMany`. Empty location strings clear the location to `{ string: "", coordinates: null }`. Successful responses include the saved normalized `location`. Invalid requests return 400; missing/foreign events return 404; database failures return 500. No Prisma migration is needed because `Event.location` is JSON.

Test: add, replace, clear and reload locations on existing events; verify persisted JSON and owner isolation. Existing records with partial location objects remain readable.
