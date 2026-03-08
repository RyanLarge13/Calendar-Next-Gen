# Calendar Next Gen

A next-generation progressive web app for staying organized with calendars, reminders, tasks, lists, kanban boards, stickies, and notifications.

Live site: `https://calng.app`

## Overview

Calendar Next Gen is a full-stack productivity application built around a PWA-first experience. The frontend is a React application powered by Vite, while the backend is an Express server with Prisma for data access.

The app is structured to support:

- Calendar-based planning
- Event and reminder creation
- Tasks and lists
- Kanban boards
- Sticky notes
- Push notifications
- Google authentication
- Google Calendar event import
- Friend / social utility features

## Features

- **Progressive Web App**
  - Installable on supported devices
  - Standalone display mode
  - Service worker support
  - App shortcuts for creating a new event or reminder

- **Calendar workflow**
  - Main calendar interface
  - Dedicated calendar views
  - Date picker utilities
  - Event and reminder flows

- **Productivity tools**
  - Tasks
  - Lists
  - Kanban boards
  - Sticky notes

- **User features**
  - Google OAuth integration
  - User context and persisted session state
  - Notification subscriptions
  - Friend-related flows and QR-based sharing helpers

- **Backend services**
  - REST routes for users, events, reminders, notifications, lists, tasks, friends, kanban, and stickies
  - Prisma-based database layer
  - Cron-based background processing
  - Email and push notification support

## Tech Stack

### Frontend

- React 18
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- React Quill / Quill
- Google OAuth libraries
- Google Maps library
- Vite PWA / Workbox

### Backend

- Node.js
- Express
- Prisma
- Redis
- Nodemailer
- Web Push
- Google APIs
- node-cron

## Project Structure

Calendar-Next-Gen/
├── backend/
│ ├── auth/
│ ├── controllers/
│ ├── emailTemplates/
│ ├── middleware/
│ ├── prisma/
│ ├── routes/
│ ├── utils/
│ ├── package.json
│ └── server.js
├── docs/
│ └── CONTRIBUTING.md
├── public/
│ ├── android/
│ ├── ios/
│ ├── screenshots/
│ ├── windows11/
│ ├── manifest.webmanifest
│ ├── registerSw.js
│ └── sw.js
├── src/
│ ├── assets/
│ ├── components/
│ ├── constants/
│ ├── context/
│ ├── states/
│ ├── utils/
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
├── package.json
├── vite.config.js
└── vercel.json

## Frontend Architecture

The frontend bootstraps from `src/main.jsx`, where the app loads global styles and registers the service worker script. The app root in `src/App.jsx` wraps the UI in providers for user, date, and interactive state, plus Google OAuth and React Router.

`MainPage.jsx` composes the main experience using:

- `Header`
- `Search`
- `SystemNotif`
- `Stickies`
- `SideBar`
- `Calendar`
- `AddCircle`
- `Views`

This suggests a central dashboard-style interface with modal or route-driven flows for creating events and reminders.

## Backend Architecture

The backend server is defined in `backend/server.js` and wires together route modules for:

- users
- events
- reminders
- notifications
- lists
- tasks
- friends
- kanban
- stickies

The backend also uses:

- CORS configuration
- environment variables via `dotenv`
- scheduled processing with `node-cron`
- a global push notification cron utility

Prisma configuration and schema live under `backend/prisma/`.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/RyanLarge13/Calendar-Next-Gen.git
cd Calendar-Next-Gen
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd backend
npm install
cd ..
```

## Running Locally

### Start the frontend

From the project root:

```bash
npm run dev
```

### Start the backend

From the `backend` directory:

```bash
npm run dev
```

## Available Scripts

### Frontend

```bash
npm run dev
npm run build
npm run preview
```

### Backend

```bash
npm run dev
npm start
```

## Environment Variables

This repository uses environment variables on both the frontend and backend.

### Frontend

Based on the codebase, you will likely need at least:

```env
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_VAPID_PUBLIC_KEY=your_web_push_public_key
```

### Backend

The backend uses `dotenv`, Prisma, Google APIs, email, Redis, and web push, so expect a `.env` with values similar to:

```env
PORT=8080
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret

# Google / OAuth / APIs
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Redis
REDIS_URL=your_redis_connection_string

# Email
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password

# Web Push
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```

You may need additional variables depending on deployment and integrations.

## PWA Notes

The manifest shows that the app is configured as an installable standalone experience and includes:

- app shortcuts for **New Event** and **New Reminder**
- screenshots for mobile and desktop
- a service worker entry
- share target support
- file handling experiments for PDFs and 3D model types

## Deployment Notes

The repository includes:

- `vercel.json` in the project root
- production CORS origins in the backend for:
  - `https://calng.app`
  - `https://www.calng.app`
  - `https://calendar-next-gen.vercel.app`

That suggests the frontend is intended for web deployment on Vercel or a similar host, while the backend is deployed separately.

## Current Documentation Status

A few project docs already exist in the repository:

- `CHANGELOG.md`
- `CODE_ASSESSMENT.md`
- `docs/CONTRIBUTING.md`
- `SECURITY.md`
- `CODE_OF_CONDUCT.md`

At the moment, the root `README.md` appears to be empty, so this draft is meant to give the project a much stronger landing page for contributors and users.

## Contributing

Please review the existing contribution and conduct files before opening a pull request:

- `docs/CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`

## License

MIT

[1]: https://raw.githubusercontent.com/RyanLarge13/Calendar-Next-Gen/main/package.json "raw.githubusercontent.com"
