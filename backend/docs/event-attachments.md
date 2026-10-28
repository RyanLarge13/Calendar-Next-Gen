# Event attachment persistence (backend)

## Previous failure
The old upload endpoint responded with HTTP 200 immediately after updating `Event.attachmentLength`, then continued uploading objects and creating `Attachment` rows and attempted to respond again. Consequently a client could see success while persistence failed. Using the raw client filename as the GCS object key also allowed two events with `photo.jpg` to overwrite the same object.

## Updated contract
- `POST /new/attachments/:newEventId` requires an authenticated user, an event owned by that user, and 1–20 image attachments.
- The current JSON request format remains `{ attachments: [{ filename, mimetype, content }] }`, where content is the serialized byte array.
- Each image must have nonempty bytes and be at most 10 MiB.
- Object keys are unique: `events/<userId>/<eventId>/<UUID>`. The original filename is stored in Prisma only.
- Files are written to GCS first. Prisma `Attachment.createMany` and atomic `Event.attachmentLength.increment` run in one transaction.
- The endpoint sends exactly one HTTP 201 **after** database persistence, with `{ message, count, attachmentLength }`.
- If any storage/database operation throws, newly uploaded objects are deleted on a best-effort basis and HTTP 500 is returned. Cloud storage and Prisma do not share a transaction; failed cleanup may require manual reconciliation.
- `GET /attachments/:eventId` verifies ownership and returns signed read URLs. URLs expire after 15 minutes.

## Verification
1. Upload two images with identical original filenames to different events. Verify distinct objects and correct images after reload.
2. Upload several images to an existing event. Verify Prisma attachment rows, correct `eventId`, and accurate count.
3. Try a nonexistent/foreign event: expect 404 and no new GCS objects.
4. Force a database failure after GCS upload: expect 500 and best-effort cleanup; check for orphaned objects.
5. Test new-event creation with attachments and confirm the count starts at zero until upload succeeds.

## Migration / limitations
Existing GCS objects and Prisma rows are **not renamed**. Previously overwritten files cannot be restored by this change. Existing inaccurate `attachmentLength` values are not automatically repaired; reconcile them against `Attachment` row counts if needed. No Prisma schema migration is required. Monitor GCS orphan cleanup and failed uploads. The legacy JSON byte-array transport remains for compatibility and is less efficient than multipart uploads.
