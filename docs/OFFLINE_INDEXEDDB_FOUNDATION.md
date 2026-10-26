# Offline IndexedDB foundation

This change introduces local persistence APIs, **not yet a fully offline-capable application**.

## Database
- Database: `myCalngDB`; minimum version **4** (enforced in UserContext).
- Existing `auth` and `locations` stores and methods are preserved.
- New stores: `events`, `lists`, `tasks`, `notes`, `users`, each keyed by `id`.
- Note: existing React `stickies` correspond to the new `notes` store. This is only a storage naming choice, not an automatic state connection.

## API

Access via the existing `localDB` value in `UserContext`, after it becomes available.

| Entity | Create | Read one | Read all | Upsert | Delete | Replace all |
| --- | --- | --- | --- | --- | --- | --- |
| Event | createEvent | getEvent | getEvents | updateEvent | deleteEvent | replaceEvents |
| List | createList | getList | getLists | updateList | deleteList | replaceLists |
| Task | createTask | getTask | getTasks | updateTask | deleteTask | replaceTasks |
| Note | createNote | getNote | getNotes | updateNote | deleteNote | replaceNotes |
| User | createUser | getUser | getUsers | updateUser | deleteUser | replaceUsers |

Generic equivalents: `create(store, record)`, `read(store, id)`, `readAll(store)`, `update(store, record)`, `remove(store, id)`, `replaceAll(store, records)`.

All operations are asynchronous and return promises. Creates use IndexedDB `add` (reject duplicate keys); updates use `put` (upsert); reads return `null` for missing IDs. Records must have an `id` and contain structured-clone-compatible data. `replaceAll` clears and inserts within a single transaction: **use cautiously**.

Example:

```js
await localDB.createList({ id: "offline-list-1", title: "Groceries", items: [] });
const lists = await localDB.getLists();
await localDB.updateList({ ...lists[0], title: "Weekly groceries" });
await localDB.deleteList("offline-list-1");
```

## Important limitations
- No automatic hydration of React state, network fallback, synchronization, conflict resolution, tombstones, offline queue, or user-account isolation yet.
- A user store does not constitute an offline authentication system. Avoid persisting passwords or sensitive tokens in user records.
- Existing auth token storage remains unchanged; browser data can be cleared and should not be treated as durable backup.
- Service-worker asset caching and API offline routing require separate work.
- Version 4 is a minimum. If the environment config supplies a version higher than 4, it remains higher.
- Never blindly replace all local records with a server response: unsynced local changes would be lost.

## Manual test plan
1. Load the app once online, open DevTools → Application → IndexedDB → `myCalngDB`, verify version and five new stores.
2. Create, read, update, delete and bulk replace each type; reload and verify persistence.
3. Disconnect the network and repeat direct IndexedDB operations in a previously loaded app.
4. Verify existing saved locations and auth token operations still work.
5. Test database upgrade from an existing version-3 installation.

No build or browser tests were executed as part of these commits.
