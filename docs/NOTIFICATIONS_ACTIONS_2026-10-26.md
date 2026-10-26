# Notification inbox controls

Implemented in `src/components/UserModal/Notification.jsx` on `dev`.

- **Mark all read**: updates only currently unread notifications through the existing `markAsRead` API, then updates local state for successful requests.
- **Mark all unread**: updates currently read notifications through `markAsUnread`, and removes successful IDs from the deferred mark-read queue.
- **Delete all**: confirmation prompt, then deletes each notification using the existing authenticated `deleteNotification` endpoint; removes successful deletions from state and the deferred queue.
- **Sort**: newest, oldest, or unread-first. Sorting is derived for rendering and does not mutate the source notification array.
- **Filters**: All, Unread, Events, Reminders, and System are now interactive; System groups types other than event/reminder.
- Bulk operations use `Promise.allSettled` so partial server failures do not cause false success for every notification. A busy guard prevents concurrent bulk actions.

## Test plan

1. Mark all read, close/reopen notifications and reload; verify server persistence.
2. Mark all unread, close/reopen and reload; verify read status persists.
3. Delete all, confirm dialog and reload; verify the inbox stays empty.
4. Test with mixed read/unread statuses and a large inbox.
5. Test newest, oldest, unread-first sorting, and all category filters.
6. Test an offline or failed request: only successful server operations should update UI.

## Notes

The existing backend exposes individual notification read/unread/delete endpoints, so bulk actions currently issue one request per affected notification. For large inboxes, dedicated batch endpoints would be more efficient. Share and Notification settings buttons are unchanged; this update covers the requested read/unread/delete/sort controls.

No frontend build or live browser test was executed through the GitHub connector.
