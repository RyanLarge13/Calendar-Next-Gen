import { useContext, useEffect, useState } from "react";
import { returnSortDatedDate } from "../../utils/helpers";
import Reminder from "./Reminder";
import UserContext from "../../context/UserContext";
import Masonry from "react-masonry-css";

const GroupedReminders = ({ groupType = "week", reminders = [] }) => {
  const { preferences } = useContext(UserContext);

  const [remindersSorted, setRemindersSorted] = useState([]);

  useEffect(() => {
    calculateReminderSorts();
  }, [reminders]);

  const breakpointColumnsObj = {
    default: 3, // Number of columns by default
    1800: 3,
    1400: 2, // Number of columns on screens > 1100px
    1000: 1,
  };

  const calculateReminderSorts = () => {
    const dateStore = new Map();

    if (groupType === null) {
      const remindersUnsorted = [
        { key: "unsorted", label: "Unsorted", reminders: reminders },
      ];
      setRemindersSorted(remindersUnsorted);
      return;
    }

    reminders.forEach((r) => {
      const date = new Date(r.time);

      if (!date) {
        return;
      }

      const { key, label } = returnSortDatedDate(groupType, date);

      if (dateStore.has(key)) {
        dateStore.get(key).reminders.push(r);
        return;
      }

      dateStore.set(key, { reminders: [r], label: label });
    });

    const remindersArrayFromMap = Array.from(dateStore, ([key, value]) => ({
      key: key,
      reminders: value.reminders,
      label: value.label,
    }));

    setRemindersSorted(remindersArrayFromMap);
  };

  return (
    <div className="mt-10">
      <div className="mx-auto max-w-6xl">
        {/* Don't forget remindersSorted is the groups! not the actual reminders. remindersSorted.reminders is the reminders */}
        {remindersSorted.length === 1 ? (
          <div>
            <h3 className="text-base sm:text-lg font-semibold tracking-tight truncate">
              {remindersSorted[0].label}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
              {remindersSorted[0].reminders.map((r) => (
                <Reminder
                  key={r.id || r._id || r.time || JSON.stringify(r)}
                  reminder={r}
                  showOpenEvent={true}
                  styles={{}}
                />
              ))}
            </div>
          </div>
        ) : (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid_reminders gap-5"
            columnClassName="my-masonry-grid_column_reminders"
          >
            {remindersSorted.map((g, index) => (
              <section
                key={g.key || index}
                className={`
              rounded-3xl border shadow-sm overflow-hidden mb-5
              ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10"
                  : "bg-white border-black/10"
              }
            `}
              >
                <div
                  className={`
                px-5 py-4 border-b
                ${
                  preferences.darkMode
                    ? "border-white/10 bg-white/[0.03]"
                    : "border-black/10 bg-black/[0.02]"
                }
              `}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p
                        className={`text-[11px] font-semibold tracking-wide ${
                          preferences.darkMode
                            ? "text-white/50"
                            : "text-slate-500"
                        }`}
                      >
                        Reminder Group
                      </p>
                      <h3 className="text-base sm:text-lg font-semibold tracking-tight truncate">
                        {g.label}
                      </h3>
                    </div>

                    <div
                      className={`
                    flex-shrink-0 px-3 py-1.5 rounded-2xl border shadow-sm text-[11px] font-semibold
                    ${
                      preferences.darkMode
                        ? "bg-white/5 border-white/10 text-white/70"
                        : "bg-black/[0.03] border-black/10 text-slate-600"
                    }
                  `}
                    >
                      {g.reminders.length}
                    </div>
                  </div>
                </div>

                <div className="p-3 sm:p-4">
                  <div className="space-y-3">
                    {g.reminders.map((r) => (
                      <Reminder
                        key={r.id || r._id || r.time || JSON.stringify(r)}
                        reminder={r}
                        showOpenEvent={true}
                        styles={{}}
                      />
                    ))}
                  </div>
                </div>
              </section>
            ))}
          </Masonry>
        )}
      </div>
    </div>
  );
};

export default GroupedReminders;
