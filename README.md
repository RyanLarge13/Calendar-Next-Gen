<div align="center">

# 📅 Calendar Next Gen

### Your calendar should be more than a grid of dates.

**Calendar Next Gen is a full-stack productivity platform that brings your calendar, reminders, tasks, lists, Kanban boards, sticky notes, notifications, and more into one connected workspace.**

[**🚀 Launch Calendar Next Gen**](https://calng.app) · [**💻 Explore the Code**](https://github.com/RyanLarge13/Calendar-Next-Gen)

`React` · `Node.js` · `Express` · `Prisma` · `Redis` · `PWA`

</div>

---

> **Hero screenshot:** Add a current, wide screenshot of the main Calendar Next Gen workspace here.

## More than a calendar.

Calendar Next Gen started with a simple idea:

**The tools you use to organize your life shouldn't all live in separate places.**

A calendar knows *when* something is happening. A reminder knows *when you need to remember it*. A task knows *what needs to get done*. Lists organize the things around it. Kanban boards track progress. Sticky notes capture the thoughts you don't want to lose.

Calendar Next Gen brings those tools together into a single productivity environment built around time, organization, and the things you're actually trying to accomplish.

And because CNG is built as a Progressive Web App, that experience isn't limited to another browser tab — it can be installed and used as an application on supported devices.

---

## ✨ One workspace. A lot going on.

### 📅 Calendar & Events

The calendar sits at the center of CNG, providing the primary interface for planning dates, navigating time, and managing events.

### ⏰ Reminders

Create reminders that work alongside the calendar and notification system so important things don't disappear into a forgotten list.

### ✅ Tasks & Lists

Organize things that need to get done without forcing everything to become a calendar event.

### 📋 Kanban Boards

Use board-based workflows when a simple task list isn't enough.

### 📝 Sticky Notes

Keep quick information and ideas immediately accessible inside the same workspace.

### 🔔 Notifications

CNG includes notification subscriptions and Web Push infrastructure, backed by server-side scheduled processing.

### 👥 Friends & Sharing

Friend-related workflows and QR utilities extend CNG beyond a purely isolated personal calendar.

### 📲 Progressive Web App

CNG is designed as an installable PWA with standalone display, service-worker support, application shortcuts, share-target support, and dedicated mobile and desktop assets.

---

## 🧠 This isn't just a frontend.

Calendar Next Gen is a full-stack application with separate client, server, data, background-processing, notification, caching, real-time, and external-integration concerns.

<pre>
                    ┌──────────────────────────┐
                    │    Calendar Next Gen     │
                    └────────────┬─────────────┘
                                 │
                    ┌────────────┴─────────────┐
                    │                          │
              React / Vite                Node / Express
                    │                          │
           Application UI                  REST API
                    │                          │
           React Router                    Prisma
                    │                          │
          Service Worker                 Data Layer
                    │
             PWA / Web Push

                         Backend Services
                               │
              ┌────────────────┼────────────────┐
              │                │                │
            Redis          Cron Jobs       External APIs
                                              │
                                      Google · Email · Push
</pre>

---

## ⚙️ Under the hood

### Frontend

The client is built with **React 18 and Vite** around a dashboard-style productivity experience. React Router handles navigation, while application providers manage shared concerns such as user, date, and interactive state.

The frontend also uses:

- Tailwind CSS
- Framer Motion
- React Quill / Quill
- Google OAuth
- Google Maps
- QR generation and scanning
- Socket.IO client
- Service-worker functionality
- Web Push subscriptions

### Backend

CNG has its own **Node.js / Express backend** rather than relying entirely on client-side services.

The server exposes application routes for:

- Users
- Events
- Reminders
- Notifications
- Lists
- Tasks
- Friends
- Kanban
- Stickies

The backend also incorporates **Prisma**, **Redis**, **Socket.IO**, **node-cron**, **Nodemailer**, **Web Push**, **Google APIs**, **JWT**, and **bcrypt**.

---

## 🔔 Notifications don't stop at the UI.

One of the more interesting parts of CNG is that reminders and notifications aren't treated as purely visual React components.

The project contains infrastructure for notification subscriptions, Web Push delivery, email, and scheduled server-side processing. Parts of the application can therefore continue doing work outside the immediate calendar interface.

---

## 📲 Built like an application.

Calendar Next Gen is designed to behave more like installed software than a traditional static website.

Its PWA configuration includes:

- Standalone display
- Service-worker support
- Mobile and desktop application assets
- Installable application behavior
- Shortcuts for creating events and reminders
- Push notification support
- Share-target support
- Mobile and desktop screenshots

**Opening your productivity system should feel like opening an app — because it is one.**

---

## 🛠️ Technology

| Area | Technologies |
| --- | --- |
| **Frontend** | React 18, Vite, React Router |
| **UI** | Tailwind CSS, Framer Motion, Quill |
| **Backend** | Node.js, Express |
| **Data & Infrastructure** | Prisma, Redis |
| **Real Time** | Socket.IO |
| **Authentication** | JWT, bcrypt, Google OAuth |
| **Notifications** | Web Push, Nodemailer, node-cron |
| **Integrations** | Google APIs, Google Maps |
| **PWA** | Service Workers, Vite PWA / Workbox |

---

## 🏗️ Repository

<pre>
Calendar-Next-Gen/
│
├── src/                    # React application
│   ├── components/
│   ├── context/
│   ├── states/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
│
├── backend/                # Node / Express application
│   ├── auth/
│   ├── controllers/
│   ├── middleware/
│   ├── prisma/
│   ├── routes/
│   ├── utils/
│   └── server.js
│
├── public/
│   ├── android/
│   ├── ios/
│   ├── screenshots/
│   ├── windows11/
│   ├── manifest.webmanifest
│   └── sw.js
│
└── docs/
</pre>

---

## 🚀 Run it locally

### Clone the repository

    git clone https://github.com/RyanLarge13/Calendar-Next-Gen.git
    cd Calendar-Next-Gen

### Install and start the frontend

    npm install
    npm run dev

### Install and start the backend

    cd backend
    npm install
    npm run dev

Additional configuration is required for services such as the database, authentication, Google integrations, Redis, email, and Web Push.

A complete development-environment guide should document the exact required environment variables separately rather than guessing them here.

---

## 🤝 Contributing

Calendar Next Gen is an actively developed project.

Bug reports, feature ideas, documentation improvements, and code contributions are welcome. Please review the project's contributing guidelines and Code of Conduct before opening a pull request.

---

<div align="center">

## Want to see what all of that actually feels like?

### [🚀 **Try Calendar Next Gen →**](https://calng.app)

Built and maintained by **Ryan Large**

</div>
