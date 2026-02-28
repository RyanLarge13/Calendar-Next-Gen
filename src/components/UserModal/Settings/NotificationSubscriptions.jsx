import React, { useContext, useEffect } from "react";
import UserContext from "../../../context/UserContext";

const NotificationSubscriptions = () => {
  const { preferences, notifSubs } = useContext(UserContext);

  useEffect(() => {
    try {
      notifSubs.forEach((sub) => {
        const parsed = JSON.parse(sub);
        console.log(parsed);
      });
    } catch (err) {
      console.log("Error parsing endpoint");
      console.log(err);
    }
  }, []);

  return (
    <div className="mt-5 bg-white">
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
