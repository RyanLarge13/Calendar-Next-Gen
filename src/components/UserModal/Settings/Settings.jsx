import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { useContext } from "react";
import { BiSolidMoon } from "react-icons/bi";
import { FaGripHorizontal, FaMinusCircle } from "react-icons/fa";
import { RiSunFill } from "react-icons/ri";
import UserContext from "../../../context/UserContext";
import Portal from "../../Misc/Portal";
import Switch from "../../Misc/Switch";
import NotificationSubscriptions from "./NotificationSubscriptions";

const Settings = ({ setOption }) => {
  const { preferences, setPreferences } = useContext(UserContext);

  const controls = useDragControls();

  const startDrag = (e) => {
    setStart(e.clientY);
    controls.start(e);
  };

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

  const setTheme = (newVal) => {
    const meta = document.getElementById("theme-color-meta");
    if (meta) {
      meta.setAttribute(
        "content",
        preferences.darkMode ? "#FFFFFF" : "#222222",
      );
    }
    const newPreferences = {
      ...preferences,
      darkMode: newVal,
    };
    localStorage.setItem("preferences", JSON.stringify(newPreferences));
    setPreferences(newPreferences);
  };

  return (
    <AnimatePresence>
      <Portal>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setOption(null)}
        />
      </Portal>
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        drag="y"
        dragSnapToOrigin={true}
        dragControls={controls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragEnd={finish}
        className={`
              fixed inset-x-0 bottom-0 z-[999]
              max-h-[92vh] overflow-hidden
              rounded-t-[32px] border shadow-2xl
              will-change-transform
              ${preferences.darkMode ? "bg-[#161616]/92 border-white/10 text-white" : "bg-white/92 border-black/10 text-slate-900"}
              backdrop-blur-md
              lg:top-0 lg:bottom-0 lg:left-[60%] lg:right-0
              lg:rounded-none lg:rounded-l-[32px] lg:max-h-screen
              `}
      >
        {/* Drag / action bar (the thing you grab) */}
        <div
          className={`
            sticky top-0 z-20
            px-5 py-4
            border-b
            ${preferences.darkMode ? "border-white/10 bg-[#161616]/70" : "border-black/10 bg-white/70"}
            backdrop-blur-md
            pointer-events-auto
          `}
          style={{ touchAction: "none" }}
          onPointerDown={startDrag}
        >
          {/* Handle */}
          <div className="flex justify-center mb-3">
            <div
              className={`
                h-1.5 w-12 rounded-full
                ${preferences.darkMode ? "bg-white/15" : "bg-black/10"}
              `}
            />
          </div>

          {/* Header row */}
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p
                className={`text-[11px] font-semibold ${
                  preferences.darkMode ? "text-white/55" : "text-slate-500"
                }`}
              >
                Preferences
              </p>
              <h2 className="text-lg font-semibold tracking-tight">Settings</h2>
            </div>

            <div className="flex items-center gap-2">
              {/* Optional: future "Reset" / "Export" button spot */}
              <button
                type="button"
                onClick={() => setOption(null)}
                className={`
                  h-10 w-10 grid place-items-center rounded-2xl border shadow-sm transition
                  active:scale-[0.97]
                  ${
                    preferences.darkMode
                      ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70 hover:text-rose-200"
                      : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600 hover:text-rose-600"
                  }
                `}
                aria-label="Close settings"
              >
                <FaMinusCircle className="text-lg" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pb-24 pt-5 overflow-y-auto scrollbar-hide">
          <div className="mx-auto w-full max-w-xl space-y-4">
            {/* Section Card */}
            <div
              className={`
                rounded-3xl border shadow-sm p-4
                ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-white border-black/10"}
              `}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">Appearance</p>
                  <p
                    className={`text-xs mt-1 ${
                      preferences.darkMode ? "text-white/55" : "text-slate-500"
                    }`}
                  >
                    Theme and visual preferences.
                  </p>
                </div>

                <div
                  className={`
                    flex-shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-2xl border shadow-sm
                    ${preferences.darkMode ? "bg-white/5 border-white/10 text-white/70" : "bg-black/[0.03] border-black/10 text-slate-600"}
                  `}
                >
                  {preferences.darkMode ? "Dark" : "Light"}
                </div>
              </div>

              <div className="mt-4">
                <Switch
                  title={
                    <div className="flex items-center gap-2">
                      <span
                        className={`
                          grid place-items-center h-9 w-9 rounded-2xl border shadow-sm
                          ${
                            preferences.darkMode
                              ? "bg-amber-500/15 border-amber-300/20 text-amber-100"
                              : "bg-slate-50 border-black/10 text-slate-700"
                          }
                        `}
                      >
                        {preferences.darkMode ? <RiSunFill /> : <BiSolidMoon />}
                      </span>
                      <div className="text-left">
                        <p className="text-sm font-semibold">Theme</p>
                        <p
                          className={`text-[11px] font-semibold ${
                            preferences.darkMode
                              ? "text-white/55"
                              : "text-slate-500"
                          }`}
                        >
                          Toggle light/dark.
                        </p>
                      </div>
                    </div>
                  }
                  styles={`
                    rounded-3xl border shadow-sm px-3 py-3
                    ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-black/[0.02] border-black/10"}
                  `}
                  value={preferences.darkMode}
                  toggle={setTheme}
                />
              </div>
            </div>

            {/* Future sections placeholder */}
            <div
              className={`
                rounded-3xl border shadow-sm p-4
                ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-white border-black/10"}
              `}
            >
              <p className="text-sm font-semibold">Coming soon</p>
              <p
                className={`text-xs mt-1 ${
                  preferences.darkMode ? "text-white/55" : "text-slate-500"
                }`}
              >
                Notifications, privacy, account, integrations, and more.
              </p>
            </div>

            <p
              className={`text-[11px] font-semibold ${
                preferences.darkMode ? "text-white/45" : "text-slate-500"
              }`}
            >
              Tip: drag the header down to close.
            </p>
          </div>

          {/* Show users logged in devices */}
          <NotificationSubscriptions />
        </div>

        {/* Bottom bar (matches your notifications style) */}
        <div
          className={`
            fixed bottom-0 !left-0 right-0 z-[999]
            px-5 py-4
            border-t
            ${preferences.darkMode ? "border-white/10 bg-[#161616]/80" : "border-black/10 bg-white/80"}
            backdrop-blur-md
            flex items-center justify-between
            lg:left-[60%]
          `}
          style={{ touchAction: "none" }}
          onPointerDown={startDrag}
        >
          <button
            type="button"
            onClick={() => setOption(null)}
            className={`
              px-4 py-2 rounded-2xl border shadow-sm text-xs font-semibold transition
              active:scale-[0.97]
              ${
                preferences.darkMode
                  ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70 hover:text-rose-200"
                  : "bg-black/[0.03] border-black/10 hover:bg-black/[0.06] text-slate-600 hover:text-rose-600"
              }
            `}
          >
            Close
          </button>

          <div
            className={`
              grid place-items-center h-9 w-12 rounded-2xl border shadow-sm
              ${preferences.darkMode ? "bg-white/5 border-white/10 text-white/60" : "bg-black/[0.03] border-black/10 text-slate-500"}
            `}
          >
            <FaGripHorizontal className="text-lg" />
          </div>

          <div
            className={`
              text-[11px] font-semibold px-3 py-2 rounded-2xl border shadow-sm
              ${preferences.darkMode ? "bg-white/5 border-white/10 text-white/70" : "bg-black/[0.03] border-black/10 text-slate-600"}
            `}
          >
            Settings
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Settings;
