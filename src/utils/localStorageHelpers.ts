import { defaultPreferences } from "../constants/defaultPreferences";
import { PreferencesType } from "../types/preferences";

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
