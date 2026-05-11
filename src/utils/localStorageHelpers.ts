import { PreferencesType, Reminders } from "../types/preferences";

export const defaultPreferences: PreferencesType = {
  darkMode: false,
  view: "default",
  doNotDisturb: false,
  lockApp: false,

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

export const LocalStorage_GetPreferences = (): PreferencesType => {
  try {
    const preferences = localStorage.getItem("preferences");
    const parsedPrefs = JSON.parse(preferences);

    return parsedPrefs;
  } catch (err) {
    console.log("Error fetching preferences from localStorage");
    console.log(err);
    return defaultPreferences;
  }
};

export const LocalStorage_StorePreferences = (
  newPreferences: PreferencesType,
): void => {
  try {
    const stringifiedPrefs = JSON.stringify(newPreferences);
    localStorage.setItem("preferences", stringifiedPrefs);
  } catch (err) {
    console.log("Error storing updated preferences in localStorage");
    console.log(err);
  }
};

export const LocalStorage_UpdateGroupingPreferences = (newGrouping: {
  complete: string;
  incomplete: string;
}): void => {
  try {
    const existingPrefs: PreferencesType = LocalStorage_GetPreferences();

    const newPrefs: PreferencesType = {
      ...existingPrefs,
      reminders: {
        complete: { groupType: newGrouping.complete },
        incomplete: { groupType: newGrouping.incomplete },
      },
    };

    LocalStorage_StorePreferences(newPrefs);
  } catch (err) {
    console.log("Error updating preferences grouping in localStorage");
  }
};
