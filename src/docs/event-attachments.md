# Event attachment UI (frontend)

## Existing event
`Event.jsx` now loads attachments by `event.id`, clears previous images when the event changes, and ignores late responses after effect cleanup. New uploads no longer display unsaved blob previews. After the server confirms persistence, the component refetches signed URLs and synchronizes `attachmentLength` into the selected event and every matching `eventMap` bucket (including recurrence index).

## New event
`AddEvent.jsx` creates the event with `attachmentLength: 0`, then calls the upload endpoint after the event has been created. On upload success it synchronizes the returned count into `eventMap`. The former one-second timer is removed. Event-created reminders now use `setRemindersMap` instead of the deleted flat-array setter.

## Test checklist
- Open event A with images, then event B without images, then A again: no cross-event previews.
- Upload images to an existing event and reopen/reload: only persisted images should display.
- Upload images with the same filename to separate events: neither should overwrite the other.
- Create a new event with images and confirm its attachment count after upload.
- Simulate a failed upload: confirm no success preview appears; inspect console error.
- Confirm signed image URLs remain usable for the expected short viewing period.

## Notes
The new-event modal closes before its attachment upload finishes; failures are currently logged to the console rather than surfaced as an in-app retry action. This is a remaining UX improvement, not a claim of guaranteed delivery. Browser tests/build have not been run as part of these commits.
