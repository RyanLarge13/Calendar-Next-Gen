I can generate a new `README.md`, but quick heads-up: GitHub’s file viewer is currently not letting me reliably pull the **actual code contents** for files like `package.json`, `vite.config.js`, or the `backend/` + `src/` trees (the pages are rendering without the file body). What I _can_ see clearly is your repo’s existing README + repo metadata (folders, topics, site link). ([GitHub][1])

So below is a **clean, modern README** built from what’s visible right now (and your repo’s declared tech/topics). Once you paste the contents of `package.json` (and `backend/README` if you have one), I can tighten this to be 100% exact for scripts, env vars, ports, and run commands.

---

## Proposed `README.md`

````md
# Calendar Next Gen (CNG)

A next-generation **PWA calendar / productivity hub** built to make day-to-day planning fast, simple, and actually enjoyable.

Live site: calng.app

> CNG is designed around “few clicks, high clarity”: create content quickly (events/reminders/tasks/boards), organize it cleanly, and keep it accessible across devices — online or offline. :contentReference[oaicite:1]{index=1}

---

## ✨ Features

From the project’s stated functionality:

- **PWA installable** (desktop + mobile) with **offline support** :contentReference[oaicite:2]{index=2}
- Create and manage:
  - Events
  - Reminders
  - Todos / Tasks
  - Kanban boards (and other utilities) :contentReference[oaicite:3]{index=3}
- **Google Calendar sync** :contentReference[oaicite:4]{index=4}
- Multiple calendar views (month/day/week/schedule) :contentReference[oaicite:5]{index=5}
- Light + dark themes, responsive UI, gestures, and performance-minded UI behavior :contentReference[oaicite:6]{index=6}
- Multiple login options (social + classic) and account management flows :contentReference[oaicite:7]{index=7}

---

## 🧰 Tech Stack

Based on repo structure and listed topics:

- **Frontend:** Vite + modern JS/TS, TailwindCSS :contentReference[oaicite:8]{index=8}
- **PWA:** Service worker / offline caching :contentReference[oaicite:9]{index=9}
- **Data:** Prisma + PostgreSQL :contentReference[oaicite:10]{index=10}
- **State/UI:** Context API (per repo topics) :contentReference[oaicite:11]{index=11}

---

## 📁 Repository Structure

High-level folders in this repo:

- `src/` — main client application source
- `public/` — static assets
- `backend/` — backend service (API / DB integration)
- `docs/` — project documentation
- `web/` — additional web assets/site-related content

(Structure inferred from the repo root file tree.) :contentReference[oaicite:12]{index=12}

---

## 🚀 Getting Started (Local Development)

### Prerequisites

- Node.js (LTS recommended)
- npm (or your preferred package manager)
- PostgreSQL (if running the backend locally)

### Install

```bash
git clone https://github.com/RyanLarge13/Calendar-Next-Gen.git
cd Calendar-Next-Gen
npm install
```
````

### Run the frontend

```bash
npm run dev
```

### Run the backend

This repo contains a `backend/` folder. Start it according to that folder’s instructions/config (commonly something like):

```bash
cd backend
npm install
npm run dev
```

> If you paste your `package.json` scripts (root + backend), I’ll update this section to match your exact commands and ports.

---

## 🔐 Environment Variables

CNG likely needs environment variables for:

- Database connection (Postgres)
- Prisma
- Auth providers (Google / etc.)
- Google Calendar sync credentials

Create local environment files as needed:

- `./.env`
- `./backend/.env`

> Paste your `.env.example` (or tell me the env var names referenced in code) and I’ll document them cleanly with explanations.

---

## 🧪 Scripts

Common scripts you probably have at the root (exact names may differ):

- `npm run dev` — run locally
- `npm run build` — production build
- `npm run preview` — preview production build

> I can make this exact once I can read your root `package.json` scripts.

---

## 🛡️ Security / Data

This project includes account creation, authentication options, and account deletion flows, and states that deleting an account removes related app data (while Google-imported events remain in Google Calendar). ([GitHub][1])

---

## 🤝 Contributing

PRs and issues are welcome. If you’re making a larger change, open a discussion first to align on direction.

- Fork the repo
- Create a feature branch
- Submit a PR with a clear description and screenshots when UI changes are involved

---

## 📄 License

MIT License. ([GitHub][1])

```

---

## If you want this README to be *exact* (recommended)
Paste these (just the text) and I’ll immediately revise the README so it matches the code perfectly:

1) **root** `package.json`
2) `backend/package.json` (if it exists)
3) any `.env.example` or config docs you already have

Then I’ll update:
- exact scripts (`dev`, `build`, `start`, etc.)
- exact ports
- exact env vars + what each does
- database + Prisma commands (`migrate`, `generate`, `studio`, etc.)
- deployment notes (you have `vercel.json` in root) :contentReference[oaicite:15]{index=15}
::contentReference[oaicite:16]{index=16}
```

[1]: https://github.com/RyanLarge13/Calendar-Next-Gen/ "GitHub - RyanLarge13/Calendar-Next-Gen: A next generation PWA calendar / utility application"
