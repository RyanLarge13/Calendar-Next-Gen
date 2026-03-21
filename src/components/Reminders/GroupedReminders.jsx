import React, { useContext, useEffect, useState } from "react";
import { returnSortDatedDate } from "../../utils/helpers";
import { motion } from "framer-motion";
import Reminder from "./Reminder";
import UserContext from "../../context/UserContext";

const GroupedReminders = ({ groupType = "week", reminders = [] }) => {
  const { preferences } = useContext(UserContext);

  const [remindersSorted, setRemindersSorted] = useState([]);
  const [hoverId, setHoverId] = useState(-0);

  useEffect(() => {
    calculateReminderSorts();
  }, [reminders]);

  const calculateReminderSorts = () => {
    const dateStore = new Map();

    reminders.forEach((r) => {
      const date = new Date(r.time);

      if (!date) {
        return;
      }

      const key = returnSortDatedDate(groupType, date);

      if (dateStore.has(key)) {
        dateStore.get(key).reminders.push(r);
        return;
      }

      dateStore.set(key, { reminders: [r] });
    });

    const remindersArrayFromMap = Array.from(dateStore, ([key, value]) => ({
      key: key,
      reminders: value.reminders,
    }));

    console.log(remindersArrayFromMap);

    setRemindersSorted(remindersArrayFromMap);
  };

  return (
    <div
      className={`
          grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3
          gap-4 sm:gap-5
        `}
    >
      {remindersSorted.map((g) => (
        <motion.div
          key={g.key}
          className="relative"
          onHoverStart={() => setHoverId(g.key)}
          onHoverEnd={() => setHoverId(-0)}
        >
          {g.reminders.map((r, index) => (
            <Reminder
              key={r.id || r._id || r.time || JSON.stringify(r)}
              reminder={r}
              showOpenEvent={true}
              styles={{
                position: hoverId === g.key ? "relative" : "absolute",
                opacity: 1,
                backdropFilter: "none",
                left: hoverId === g.key ? 0 : index * 25,
                top: hoverId === g.key ? 0 : index * 20,
                backgroundColor: preferences.darkMode ? "#000" : "#FFF",
              }}
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export default GroupedReminders;
