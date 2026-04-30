import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { useContext, useState } from "react";
import { BiSolidMoon } from "react-icons/bi";
import { FaGripHorizontal, FaMinusCircle } from "react-icons/fa";
import { RiSunFill } from "react-icons/ri";
import UserContext from "../../../context/UserContext";
import Portal from "../../Misc/Portal";
import Switch from "../../Misc/Switch";
import NotificationSubscriptions from "./NotificationSubscriptions";
import SettingsSection from "./SettingsSection";
import SelectPill from "./SelectPill";
import SettingRow from "./SettingRow";

const Settings = ({ setOption }) => {
  const { preferences, setPreferences } = useContext(UserContext);

  const [start, setStart] = useState(0);

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
              max-h-[100vh] overflow-hidden
              rounded-t-[32px] border shadow-2xl
              will-change-transform
              ${preferences.darkMode ? "bg-[#161616]/75 border-white/10 text-white" : "bg-white/92 border-black/10 text-slate-900"}
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
        <div
          className={`px-5 pb-[250px] pt-5 overflow-y-auto max-h-screen scrollbar-hide ${preferences.darkMode ? "bg-black/[0.03]" : " bg-white/80"}`}
        >
          <div className="mx-auto w-full max-w-xl space-y-4 mb-10">
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

            {/* App behavior */}
            <SettingsSection
              title="App Behavior"
              description="Control the default view and app-level behavior."
              badge={preferences.view || "Calendar"}
              preferences={preferences}
            >
              <SettingRow
                title="Default View"
                description="Choose what opens first."
                preferences={preferences}
              >
                <SelectPill
                  value={preferences.view || "Month"}
                  options={["Month", "Week", "Day", "Agenda"]}
                  preferences={preferences}
                  onChange={(value) => {
                    console.log("TODO: update preferences.view", value);
                  }}
                />
              </SettingRow>

              <Switch
                title="Do Not Disturb"
                styles={`
      rounded-3xl border shadow-sm px-3 py-3
      ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-black/[0.02] border-black/10"}
    `}
                value={preferences.doNotDisturb}
                toggle={(value) => {
                  console.log("TODO: update preferences.doNotDisturb", value);
                }}
              />

              <Switch
                title="Lock App"
                styles={`
      rounded-3xl border shadow-sm px-3 py-3
      ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-black/[0.02] border-black/10"}
    `}
                value={preferences.lockApp}
                toggle={(value) => {
                  console.log("TODO: update preferences.lockApp", value);
                }}
              />
            </SettingsSection>

            {/* Main Menu */}
            <SettingsSection
              title="Main Menu"
              description="Choose what appears on the main menu."
              badge={
                preferences.mainMenuPage?.defaultPageOpening || "Dashboard"
              }
              preferences={preferences}
            >
              <SettingRow
                title="Default Opening"
                description="The first page shown in the menu."
                preferences={preferences}
              >
                <SelectPill
                  value={
                    preferences.mainMenuPage?.defaultPageOpening || "Dashboard"
                  }
                  options={["Dashboard", "Events", "Tasks", "Reminders"]}
                  preferences={preferences}
                  onChange={(value) => {
                    console.log(
                      "TODO: update mainMenuPage.defaultPageOpening",
                      value,
                    );
                  }}
                />
              </SettingRow>

              {[
                ["showEvents", "Events"],
                ["showWeather", "Weather"],
                ["showReminders", "Reminders"],
                ["showTasks", "Tasks"],
                ["showNotes", "Notes"],
                ["showKanban", "Kanban"],
                ["showAppointments", "Appointments"],
                ["showLists", "Lists"],
              ].map(([key, label]) => (
                <Switch
                  key={key}
                  title={label}
                  styles={`
        rounded-3xl border shadow-sm px-3 py-3
        ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-black/[0.02] border-black/10"}
      `}
                  value={preferences.mainMenuPage?.[key]}
                  toggle={(value) => {
                    console.log(`TODO: update mainMenuPage.${key}`, value);
                  }}
                />
              ))}
            </SettingsSection>

            {/* Sidebar */}
            <SettingsSection
              title="Sidebar"
              description="Manage sidebar visibility and shortcuts."
              badge={preferences.showSidebar?.on ? "On" : "Off"}
              preferences={preferences}
            >
              <Switch
                title="Show Sidebar"
                styles={`
      rounded-3xl border shadow-sm px-3 py-3
      ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-black/[0.02] border-black/10"}
    `}
                value={preferences.showSidebar?.on}
                toggle={(value) => {
                  console.log("TODO: update showSidebar.on", value);
                }}
              />

              <Switch
                title="Sidebar Events"
                styles={`
      rounded-3xl border shadow-sm px-3 py-3
      ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-black/[0.02] border-black/10"}
    `}
                value={preferences.showSidebar?.showEvents}
                toggle={(value) => {
                  console.log("TODO: update showSidebar.showEvents", value);
                }}
              />

              <Switch
                title="Sidebar Reminders"
                styles={`
      rounded-3xl border shadow-sm px-3 py-3
      ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-black/[0.02] border-black/10"}
    `}
                value={preferences.showSidebar?.showReminders}
                toggle={(value) => {
                  console.log("TODO: update showSidebar.showReminders", value);
                }}
              />
            </SettingsSection>

            {/* Events */}
            <SettingsSection
              title="Events"
              description="Control event filtering and sorting."
              badge={preferences.events?.sort || "Default"}
              preferences={preferences}
            >
              <SettingRow
                title="Filter"
                description="Which events to show."
                preferences={preferences}
              >
                <SelectPill
                  value={preferences.events?.filter || "All"}
                  options={["All", "Upcoming", "Past", "Repeating"]}
                  preferences={preferences}
                  onChange={(value) => {
                    console.log("TODO: update events.filter", value);
                  }}
                />
              </SettingRow>

              <SettingRow
                title="Sort"
                description="How events are ordered."
                preferences={preferences}
              >
                <SelectPill
                  value={preferences.events?.sort || "Newest"}
                  options={["Newest", "Oldest", "A-Z", "Custom"]}
                  preferences={preferences}
                  onChange={(value) => {
                    console.log("TODO: update events.sort", value);
                  }}
                />
              </SettingRow>
            </SettingsSection>

            {/* Reminders */}
            <SettingsSection
              title="Reminders"
              description="Manage grouping for complete and incomplete reminders."
              preferences={preferences}
            >
              <SettingRow
                title="Incomplete Grouping"
                description="Group active reminders by."
                preferences={preferences}
              >
                <SelectPill
                  value={preferences.reminders?.incomplete?.groupType || "Date"}
                  options={["Date", "Priority", "List", "None"]}
                  preferences={preferences}
                  onChange={(value) => {
                    console.log(
                      "TODO: update reminders.incomplete.groupType",
                      value,
                    );
                  }}
                />
              </SettingRow>

              <SettingRow
                title="Complete Grouping"
                description="Group finished reminders by."
                preferences={preferences}
              >
                <SelectPill
                  value={preferences.reminders?.complete?.groupType || "Date"}
                  options={["Date", "Priority", "List", "None"]}
                  preferences={preferences}
                  onChange={(value) => {
                    console.log(
                      "TODO: update reminders.complete.groupType",
                      value,
                    );
                  }}
                />
              </SettingRow>
            </SettingsSection>

            {/* Stickies */}
            <SettingsSection
              title="Stickies"
              description="Quick-note behavior."
              badge={preferences.stickies?.autoSave ? "Auto" : "Manual"}
              preferences={preferences}
            >
              <Switch
                title="Auto Save"
                styles={`
      rounded-3xl border shadow-sm px-3 py-3
      ${preferences.darkMode ? "bg-white/5 border-white/10" : "bg-black/[0.02] border-black/10"}
    `}
                value={preferences.stickies?.autoSave}
                toggle={(value) => {
                  console.log("TODO: update stickies.autoSave", value);
                }}
              />
            </SettingsSection>

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
            fixed !bottom-0 !left-0 right-0 z-[999]
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
