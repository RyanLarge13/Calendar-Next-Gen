import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import UserContext from "../context/UserContext";

const MainMenu = ({ timeOfDay }) => {
  const { user, upcoming } = useContext(UserContext);

  return (
    <motion.div
      initial={{ x: "-10%", opacity: 0 }}
      exit={{ x: "-10%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="pt-10"
    >
      <h1 className="text-4xl pb-2 font-semibold">{timeOfDay}</h1>
      {user.username && <p className="ml-5 font-semibold">{user.username}</p>}
      <div className="px-5 mt-5">
        <p className="text-sm">
          You have a few upcoming Events on your agenda this week
        </p>
        <div className="mt-3">
          {upcoming.length > 0 &&
            upcoming.map((event) => (
              <div
                key={event.id}
                className={`${event.color} p-3 rounded-md shadow-md`}
              >
                <p className="mb-2">
                  In{" "}
                  <span className="text-2xl font-semibold">{event.diff}</span>{" "}
                  days
                </p>
                <p className="text-sm bg-white p-2 rounded-md shadow-md font-semibold">
                  {event.summary}
                </p>
                <p className="text-sm mt-2 bg-white bg-opacity-25 p-2 rounded-md shadow-md">
                  {event.description}
                </p>
              </div>
            ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MainMenu;
