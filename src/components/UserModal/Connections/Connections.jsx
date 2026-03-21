import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { AiOutlineArrowDown } from "react-icons/ai";
import UserContext from "../../../context/UserContext";
import ConnectionRequests from "./ConnectionRequests";
import FriendRequest from "./FriendRequest";
import Friends from "./Friends";
import Portal from "../../Misc/Portal";

const Connections = ({ setOption }) => {
  const { preferences } = useContext(UserContext);

  const [options, setOptions] = useState(0);

  const finish = (e, info) => {
    const dragDistance = info.offset.y;
    const cancelThreshold = 175;

    if (dragDistance > cancelThreshold) {
      setOption(null);
    }
    if (dragDistance < cancelThreshold) {
      return;
    }
  };

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0 }}
      dragSnapToOrigin={true}
      onDragEnd={finish}
      initial={{ opacity: 0, y: 40 }}
      exit={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className={`
          fixed z-[999] inset-x-0 bottom-0 top-0
          lg:left-[60%] lg:right-0
          rounded-none lg:rounded-l-[32px]
          border-l shadow-2xl
          ${
            preferences.darkMode
              ? "bg-[#161616]/92 border-white/10"
              : "bg-white/75 border-black/10"
          }
          backdrop-blur-md
          flex flex-col
        `}
    >
      <Portal>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
          onClick={() => setOption(null)}
        />
      </Portal>
      {/* Header / drag bar */}
      <div
        className={`
            sticky top-0 z-20
            px-5 pt-4 pb-4
            border-b
            ${
              preferences.darkMode
                ? "border-white/10 bg-[#161616]/80"
                : "border-black/10 bg-white/80"
            }
            backdrop-blur-md
          `}
      >
        <div className="flex justify-center mb-3">
          <div
            className={`
                h-1.5 w-12 rounded-full
                ${preferences.darkMode ? "bg-white/15" : "bg-black/10"}
              `}
          />
        </div>

        <div className="flex justify-between items-center gap-3">
          <div className="min-w-0">
            <p
              className={`text-[11px] font-semibold ${
                preferences.darkMode ? "text-white/55" : "text-slate-500"
              }`}
            >
              Social
            </p>
            <h2 className="text-lg font-semibold tracking-tight">
              Connections
            </h2>
          </div>

          <button
            onClick={() => setOption(null)}
            className={`
                h-10 w-10 grid place-items-center rounded-2xl border shadow-sm transition
                active:scale-[0.97]
                ${
                  preferences.darkMode
                    ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70"
                    : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600"
                }
              `}
            aria-label="Close connections"
            type="button"
          >
            <AiOutlineArrowDown className="text-lg" />
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setOptions(0)}
            className={`
                flex-shrink-0 px-4 py-2 rounded-2xl border shadow-sm text-xs font-semibold transition
                active:scale-[0.97]
                ${
                  options === 0
                    ? preferences.darkMode
                      ? "bg-cyan-500/15 border-cyan-300/20 text-cyan-100"
                      : "bg-cyan-50 border-cyan-200 text-cyan-700"
                    : preferences.darkMode
                      ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                      : "bg-black/[0.03] border-black/10 text-slate-600 hover:bg-black/[0.06]"
                }
              `}
          >
            Friends
          </button>

          <button
            onClick={() => setOptions(1)}
            className={`
                flex-shrink-0 px-4 py-2 rounded-2xl border shadow-sm text-xs font-semibold transition
                active:scale-[0.97]
                ${
                  options === 1
                    ? preferences.darkMode
                      ? "bg-cyan-500/15 border-cyan-300/20 text-cyan-100"
                      : "bg-cyan-50 border-cyan-200 text-cyan-700"
                    : preferences.darkMode
                      ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                      : "bg-black/[0.03] border-black/10 text-slate-600 hover:bg-black/[0.06]"
                }
              `}
          >
            Friend Requests
          </button>

          <button
            onClick={() => setOptions(2)}
            className={`
                flex-shrink-0 px-4 py-2 rounded-2xl border shadow-sm text-xs font-semibold transition
                active:scale-[0.97]
                ${
                  options === 2
                    ? preferences.darkMode
                      ? "bg-cyan-500/15 border-cyan-300/20 text-cyan-100"
                      : "bg-cyan-50 border-cyan-200 text-cyan-700"
                    : preferences.darkMode
                      ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                      : "bg-black/[0.03] border-black/10 text-slate-600 hover:bg-black/[0.06]"
                }
              `}
          >
            Connection Requests
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-5">
        <div className="mx-auto w-full max-w-xl">
          {options === 0 && <Friends />}
          {options === 1 && <FriendRequest />}
          {options === 2 && <ConnectionRequests />}
        </div>
      </div>

      {/* Bottom handle bar */}
      <div
        className={`
            border-t px-5 py-4 flex items-center justify-between
            ${
              preferences.darkMode
                ? "border-white/10 bg-[#161616]/80"
                : "border-black/10 bg-white/80"
            }
            backdrop-blur-md
          `}
      >
        <button
          type="button"
          onClick={() => setOption(null)}
          className={`
              px-4 py-2 rounded-2xl border shadow-sm text-xs font-semibold transition
              active:scale-[0.97]
              ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                  : "bg-black/[0.03] border-black/10 text-slate-600 hover:bg-black/[0.06]"
              }
            `}
        >
          Close
        </button>

        <div
          className={`
              h-9 w-12 grid place-items-center rounded-2xl border shadow-sm
              ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10 text-white/60"
                  : "bg-black/[0.03] border-black/10 text-slate-500"
              }
            `}
        >
          <AiOutlineArrowDown className="text-lg" />
        </div>

        <div
          className={`
              px-3 py-2 rounded-2xl border shadow-sm text-[11px] font-semibold
              ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10 text-white/70"
                  : "bg-black/[0.03] border-black/10 text-slate-600"
              }
            `}
        >
          {options === 0
            ? "Friends"
            : options === 1
              ? "Friend Requests"
              : "Connection Requests"}
        </div>
      </div>
    </motion.div>
  );
};

export default Connections;
