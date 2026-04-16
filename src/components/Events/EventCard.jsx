import { motion } from "framer-motion";
import { FiRepeat } from "react-icons/fi";
import { IoIosAlarm } from "react-icons/io";
import {
  MdEventAvailable,
  MdEventNote,
  MdEventRepeat,
  MdLocationPin,
} from "react-icons/md";
import { tailwindBgToHex } from "../../utils/helpers.js";
import { useContext } from "react";
import UserContext from "../../context/UserContext";

const EventCard = ({ event, styles = {} }) => {
  const { preferences } = useContext(UserContext);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={styles}
      className={`
        group relative mt-5 rounded-3xl border shadow-sm overflow-hidden
        transition-all duration-200 cursor-pointer
        hover:shadow-md hover:scale-[1.01]
        ${
          preferences.darkMode
            ? "bg-[#161616]/88 border-white/10 text-white"
            : "bg-white/92 border-black/10 text-slate-900"
        }
        backdrop-blur-md
      `}
    >
      {/* Left accent rail */}
      <div
        className={`${event.color} absolute left-0 top-0 bottom-0 w-[10px]`}
      />

      <div className="px-4 py-4 pl-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p
              className={`text-[10px] font-semibold tracking-wide ${
                preferences.darkMode ? "text-white/50" : "text-slate-500"
              }`}
            >
              {event.kind || "Event"}
            </p>

            <h3
              style={{ color: tailwindBgToHex(event.color) }}
              className="mt-1 text-sm font-bold leading-tight truncate"
            >
              {event.summary}
            </h3>
          </div>

          {/* Meta icons */}
          <div
            className={`
              flex items-center gap-1.5 flex-shrink-0
              ${preferences.darkMode ? "text-white/55" : "text-slate-500"}
            `}
          >
            {event.kind === "Event" && (
              <span
                className={`
                  grid place-items-center h-7 w-7 rounded-2xl border shadow-sm
                  ${
                    preferences.darkMode
                      ? "bg-white/5 border-white/10"
                      : "bg-black/[0.03] border-black/10"
                  }
                `}
              >
                <MdEventNote className="text-sm" />
              </span>
            )}

            {event.kind === "Reminder" && (
              <span
                className={`
                  grid place-items-center h-7 w-7 rounded-2xl border shadow-sm
                  ${
                    preferences.darkMode
                      ? "bg-white/5 border-white/10"
                      : "bg-black/[0.03] border-black/10"
                  }
                `}
              >
                <MdEventAvailable className="text-sm" />
              </span>
            )}

            {event.kind === "Repeat" && (
              <span
                className={`
                  grid place-items-center h-7 w-7 rounded-2xl border shadow-sm
                  ${
                    preferences.darkMode
                      ? "bg-white/5 border-white/10"
                      : "bg-black/[0.03] border-black/10"
                  }
                `}
              >
                <MdEventRepeat className="text-sm" />
              </span>
            )}

            {event.repeats.repeat && (
              <span
                className={`
                  grid place-items-center h-7 w-7 rounded-2xl border shadow-sm
                  ${
                    preferences.darkMode
                      ? "bg-white/5 border-white/10"
                      : "bg-black/[0.03] border-black/10"
                  }
                `}
              >
                <FiRepeat className="text-sm" />
              </span>
            )}

            {event.reminders.reminder && (
              <span
                className={`
                  grid place-items-center h-7 w-7 rounded-2xl border shadow-sm
                  ${
                    preferences.darkMode
                      ? "bg-white/5 border-white/10"
                      : "bg-black/[0.03] border-black/10"
                  }
                `}
              >
                <IoIosAlarm className="text-sm" />
              </span>
            )}

            {event.location && (
              <span
                className={`
                  grid place-items-center h-7 w-7 rounded-2xl border shadow-sm
                  ${
                    preferences.darkMode
                      ? "bg-white/5 border-white/10"
                      : "bg-black/[0.03] border-black/10"
                  }
                `}
              >
                <MdLocationPin className="text-sm" />
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <div
          className={`
            mt-3 rounded-2xl border px-3 py-2 break-words
            ${
              preferences.darkMode
                ? "bg-white/5 border-white/10 text-white/75"
                : "bg-black/[0.03] border-black/10 text-slate-700"
            }
          `}
        >
          <p className="text-sm leading-relaxed">
            {event.description || "No description provided."}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
