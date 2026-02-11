import React, { useContext } from "react";
import UserContext from "../../../context/UserContext";

const NotificationSubscriptions = () => {
  const { preferences, notifSubs } = useContext(UserContext);

  return (
    <div className="mt-5">
      <p
        className={`text-[11px] font-semibold ${
          preferences.darkMode ? "text-white/45" : "text-slate-500"
        }`}
      >
        Your Devices
      </p>
      <div className="mt-2">
        {notifSubs.map((ns) => (
          <div key={ns}>
            <p>{ns}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSubscriptions;
