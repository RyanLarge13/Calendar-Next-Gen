import { useContext, useState } from "react";
import UserContext from "../../../context/UserContext";
import { BsCalendarDay, BsCalendarMonth } from "react-icons/bs";
import { BiCalendarWeek, BiCustomize, BiTimer } from "react-icons/bi";
import { MdSaveAlt, MdTimelapse } from "react-icons/md";
import Portal from "../../Misc/Portal";
import TimeSetter from "../../DatePickers/TimeSetter";
import { addReminder, createNotification } from "../../../utils/api";
import { getAuthToken } from "../../../utils/helpers";

const FollowUpReminder = ({ reminder }) => {
  const { preferences, setReminders, setNotifications, user } =
    useContext(UserContext);

  const [title, setTitle] = useState(reminder.title);
  const [desc, setDesc] = useState(reminder.notes);
  const [pickTime, setPickTime] = useState(false);
  const [baseDate, setBaseDate] = useState(reminder.time);

  const changeDate = (newDate) => {
    const newestDate = new Date(newDate);

    newestDate.setHours(baseDate.getHours());
    newestDate.setMinutes(baseDate.getMinutes());

    setBaseDate(newDate);
  };

  const createOfficialTime = (timeData) => {
    const { hour, minutes } = timeData;

    const updatedDate = new Date(baseDate);

    updatedDate.setHours(hour);
    updatedDate.setMinutes(minutes);

    setBaseDate(updatedDate);
  };

  const saveFollowUp = async () => {
    const newReminder = {
      ...reminder,
      title,
      notes: desc,
      time: baseDate.toString(),
    };

    const newNotification = {
      type: "reminder",
      time: baseDate.toString(),
      read: false,
      readTime: "",
      notifData: {
        eventRefIId: reminder.eventRefId,
        time: baseDate.toString(),
        notes: desc,
        title,
        userId: user.id,
      },
      userId: user.id,
      sentNotification: false,
      sentWebPush: false,
      deviceExceptions: reminder.ignoreDevices || [],
    };

    setReminders((prev) => [...prev, newReminder]);

    try {
      const token = getAuthToken();
      await addReminder(newReminder, token);
      await createNotification(newNotification, token);
    } catch (err) {
      console.log(
        "Error adding new follow up reminder and or creating new follow up notification or pulling token",
      );
      console.log(err);
    }
  };

  return (
    <div
      className={`
              rounded-3xl border shadow-sm p-4 sm:p-5
              backdrop-blur-md
              ${
                preferences.darkMode
                  ? "bg-[#161616]/65 border-white/10"
                  : "bg-white/75 border-black/10"
              }
            `}
    >
      {" "}
      <h3
        className={`text-base font-semibold mt-1 ${
          preferences.darkMode ? "text-white/80" : "text-slate-600"
        }`}
      >
        Follow Up reminder
      </h3>
      <p
        className={`text-sm mt-2 ${
          preferences.darkMode ? "text-white/65" : "text-slate-600"
        }`}
      >
        Mark this reminder as complete, but create a follow up to make sure
        things were done properly and nothing was missed
        <br />
        <br />
        We will keep the time the same just push it into the future
      </p>
      {/* Title field */}
      <div className="mt-4">
        <input
          className={`
          w-full px-4 py-3 rounded-2xl border shadow-inner transition
          text-sm font-semibold
          outline-none focus:outline-none
          ${
            preferences.darkMode
              ? "bg-white/5 border-white/10 placeholder:text-white/35 text-white/90 focus:bg-white/10"
              : "bg-black/[0.03] border-black/10 placeholder:text-slate-400 text-slate-900 focus:bg-black/[0.05]"
          }
        `}
          placeholder={originalTitle}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      {/* Notes field */}
      <div className="mt-3">
        <input
          className={`
          w-full px-4 py-3 rounded-2xl border shadow-inner transition
          text-xs font-semibold
          outline-none focus:outline-none
          ${
            preferences.darkMode
              ? "bg-white/5 border-white/10 placeholder:text-white/35 text-white/75 focus:bg-white/10"
              : "bg-black/[0.03] border-black/10 placeholder:text-slate-400 text-slate-700 focus:bg-black/[0.05]"
          }
        `}
          placeholder={originalDesc}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>
      {/* Quick action buttons for saving follow up */}
      <div
        className={`mb-4 flex flex-wrap gap-2 mt-5 
                rounded-3xl border shadow-sm px-5 py-4
                backdrop-blur-md
                ${
                  preferences.darkMode
                    ? "bg-[#161616]/70 border-white/10 text-white"
                    : "bg-white/70 border-black/10 text-slate-900"
                }
              `}
      >
        <button
          onClick={() => {
            const next = new Date(baseDate);
            next.setDate(next.getDate() + 1);
            changeDate(next);
          }}
          className={`
                    px-3 py-1.5 flex justify-start items-center text-center gap-x-2 rounded-2xl border shadow-sm text-[11px] font-semibold
                    ${
                      preferences.darkMode
                        ? "bg-indigo-500/15 border-indigo-300/20 text-indigo-100"
                        : "bg-indigo-50 border-indigo-200 text-indigo-700"
                    }
                  `}
        >
          Tomorrow <BsCalendarDay className="text-lg" />
        </button>
        <button
          onClick={() => {
            const next = new Date(baseDate);
            next.setDate(next.getDate() + 7);
            changeDate(next);
          }}
          className={`
                    px-3 py-1.5 flex justify-start items-center text-center gap-x-2 rounded-2xl border shadow-sm text-[11px] font-semibold
                    ${
                      preferences.darkMode
                        ? "bg-pink-500/15 border-pink-300/20 text-pink-100"
                        : "bg-pink-50 border-pink-200 text-pink-700"
                    }
                  `}
        >
          Next Week <BiCalendarWeek className="text-lg" />
        </button>
        <button
          onClick={() => {
            const next = new Date(baseDate);

            const day = next.getDate();
            next.setDate(1); // prevent overflow
            next.setMonth(next.getMonth() + 1);

            // clamp to last day of new month
            const lastDay = new Date(
              next.getFullYear(),
              next.getMonth() + 1,
              0,
            ).getDate();
            next.setDate(Math.min(day, lastDay));

            changeDate(next);
          }}
          className={`
                    px-3 py-1.5 flex justify-start items-center text-center gap-x-2 rounded-2xl border shadow-sm text-[11px] font-semibold
                    ${
                      preferences.darkMode
                        ? "bg-amber-500/15 border-amber-300/20 text-amber-100"
                        : "bg-amber-50 border-amber-200 text-amber-700"
                    }
                  `}
        >
          Next Month <BsCalendarMonth className="text-lg" />
        </button>
        <button
          onClick={() => setPickTime(true)}
          className={`
                    px-3 py-1.5 flex justify-start items-center text-center gap-x-2 rounded-2xl border shadow-sm text-[11px] font-semibold
                    ${
                      preferences.darkMode
                        ? "bg-cyan-500/15 border-cyan-300/20 text-cyan-100"
                        : "bg-cyan-50 border-cyan-200 text-cyan-700"
                    }
                  `}
        >
          Pick A Time <BiCustomize className="text-lg" />
        </button>
      </div>
      {pickTime ? (
        <Portal>
          <TimeSetter
            saveData={createOfficialTime}
            cancelTimeSetter={() => setPickTime(false)}
            dateChangerCallback={(newDateStr) => changeDate(newDateStr)}
          />
        </Portal>
      ) : null}
      <button
        onClick={saveFollowUp}
        className={`
                    px-3 py-1.5 flex justify-start items-center text-center gap-x-2 rounded-2xl border shadow-sm text-[11px] font-semibold
                    ${
                      preferences.darkMode
                        ? "bg-cyan-500/15 border-cyan-300/20 text-cyan-100"
                        : "bg-cyan-50 border-cyan-200 text-cyan-700"
                    }
                  `}
      >
        Save for{" "}
        {newTime.toLocaleTimeString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
        })}{" "}
        <MdSaveAlt className="text-lg" />
      </button>
    </div>
  );
};

export default FollowUpReminder;
