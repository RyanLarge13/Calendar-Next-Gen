import { PreferencesType } from "../types/preferences";

export const defaultPreferences: PreferencesType = {
  darkMode: false,
  view: "default",
  doNotDisturb: false,
  lockApp: {
    enabled: false,
    method: "pin",
    lockOnClose: true,
    lockAfterMinutes: 5,
  },

  notifications: {
    vibrationPattern: [200, 100, 200],
  },

  tasks: {},

  reminders: {
    complete: {
      groupType: "month",
    },
    incomplete: {
      groupType: "month",
    },
  },

  lists: {},

  events: {
    filter: "all",
    sort: "date",
  },

  stickies: {
    autoSave: true,
  },

  popup: {
    on: true,
    showReminders: true,
    showEvents: true,
    quickButtons: [],
  },

  showSidebar: {
    on: true,
    showEvents: true,
    showReminders: true,
  },

  mainMenuPage: {
    defaultPageOpening: "home",
    showEvents: true,
    showWeather: true,
    showReminders: true,
    showTasks: true,
    showNotes: true,
    showKanban: true,
    showAppointments: true,
    showLists: true,
  },
};
