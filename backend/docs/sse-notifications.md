# SSE notification lifecycle — backend

## Changes
- Each HTTP stream is tracked as its own client object. Closing an older request removes **only that request**, never the response belonging to a newer connection.
- The endpoint writes an SSE retry hint (5 seconds) and sends comment heartbeats every 25 seconds to keep idle connections active.
- A shared 15-second interval polls pending notifications once per connected user, rather than scheduling a separate cron job for every browser connection.
- Delivery fans out to all active connections for a user (multiple tabs/devices). A notification is marked sent only after at least one stream write is accepted.
- Concurrent polls for the same user are guarded. No artificial 3-second delayed sends remain.

## Important limitations
- **Authentication is intentionally unchanged**: the existing user-ID URL endpoint remains unauthenticated. This must be fixed separately.
- A successful HTTP stream write is not a browser acknowledgement. A disconnect after write may lose a notification, and a crash before database update can cause redelivery. The frontend deduplicates notifications by ID.
- In-memory connections and polling are per Node.js process. Multi-replica deployments need a shared dispatcher/pubsub and durable delivery model.
- SSE and web push are separate notification channels.

## Manual tests
Open two tabs for the same user, wait longer than a minute, send a notification, close either tab, and confirm the other remains connected. Check 25-second heartbeat frames in Network. Simulate network loss/reconnect and confirm the browser recovers. Inspect Prisma `sentNotification` when no clients are connected.
