import { useContext, useRef } from "react";
import UserContext from "../../context/UserContext";
import ReminderNotification from "./ReminderNotification";

const ReminderNotifications = () => {
  const { reminderNotifications } = useContext(UserContext);

  const remindersVibrated = useRef([]);

  return reminderNotifications.length > 0
    ? reminderNotifications.map((n) => (
        <ReminderNotification n={n} remindersVibrated={remindersVibrated} />
      ))
    : null;
};

export default ReminderNotifications;
