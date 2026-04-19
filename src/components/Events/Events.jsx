import React, { useContext, useEffect, useState } from "react";
import UserContext from "../../context/UserContext";

const Events = () => {
  const { preferences, eventMap } = useContext(UserContext);

  const [recentEvents, setRecentEvents] = useState([]);

  useEffect(() => {
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${now.getMonth()}`;

    const eventsForTheMonth = eventMap.get(currentMonthKey)?.events || [];

    setRecentEvents(eventsForTheMonth);

  }, [eventsMap]);

  return <div>Events</div>;
};

export default Events;
