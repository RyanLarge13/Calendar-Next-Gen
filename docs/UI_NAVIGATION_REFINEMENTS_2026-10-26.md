# UI navigation refinements

Frontend-only changes on `dev`.

- Notification cards now animate to intrinsic content height instead of fixed 175/400px heights; expanded notes and action rows determine their size.
- The main menu occupies the full viewport width and `100dvh` height on mobile. Desktop retains its centered card presentation.
- Removed the menu's standalone `popstate` listener, which competed with other back handlers.
- `MainPage.jsx` now owns a single back/keyboard dismissal handler. It closes the highest-priority active UI layer: full date picker, date picker, notifications, modal, selected event, login, menu category, then menu.
- Escape and Backspace work when focus is outside editable fields. Text inputs, textareas, selects and contenteditable elements retain normal editing behavior.
- Existing browser-history pushes are retained. This iteration does **not** guarantee a history entry for every possible overlay or implement a full history stack.

## Manual verification
1. Expand notifications with short and long notes; confirm smooth animation without clipping.
2. Open the main menu on Android; verify no left/right or top/bottom gaps and that scrolling works.
3. Navigate into menu categories; use Android back, browser back, Escape and Backspace.
4. Open event details, modal, login, notifications and date pickers; verify each back action dismisses the topmost view.
5. Test Backspace while typing in search, notes and form inputs; verify characters are deleted rather than dismissing the UI.
6. Check deep links and browser forward/back history, especially when multiple overlays have been opened.

No frontend build or browser test was run through the GitHub connector.
