import { ReactElement } from "react";

export type Preferences = {
  darkMode: boolean;
  view: string;
  doNotDisturb: boolean;
  lockApp: boolean;
  notifications: Notification;
  tasks: Tasks;
  reminders: Reminders;
  lists: Lists;
  events: Events;
  stickies: Stickies;
  popup: Popup;
  showSidebar: Sidebar;
  mainMenuPage: MainMenuPage;
};

// Notification preferences
export type Notification = {
  vibrationPattern: number[];
};

// Stickies preferences
export type Stickies = {
  autoSave: boolean;
};

// Main menu preferences
export type MainMenuPage = {
  defaultPageOpening: string;
  showEvents: boolean;
  showWeather: boolean;
  showReminders: boolean;
  showTasks: boolean;
  showNotes: boolean;
  showKanban: boolean;
  showAppointments: boolean;
  showLists: boolean;
};

// Sidebar preferences
export type Sidebar = {
  on: boolean;
  showEvents: boolean;
  showReminders: boolean;
};

// Popup preferences
export type Popup = {
  on: boolean;
  showReminders: boolean;
  showEvents: boolean;
  quickButtons: PopUpQuickButton[];
};

export type PopUpQuickButton = {
  func: () => void;
  title: string;
  icon: ReactElement;
};

// Event preferences
export type Events = {
  filter: string;
  sort: string;
};

// List preferences
export type Lists = Record<string, List>;

export type List = {
  sortOrder: number;
  lastCustomOrder: string[];
};

// Task preferences
export type Tasks = Record<string, Task>;

export type Task = {
  sortOrder: number;
};

// Reminder preferences
export type Reminders = {
  complete: ReminderGroup;
  incomplete: ReminderGroup;
};

export type ReminderGroup = {
  groupType: string;
};
