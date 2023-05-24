import { useContext } from "react";
import UserContext from "../context/UserContext";

const Notification = () => {
  const { notifications, setNotifications } = useContext(UserContext);

  return (
    <div className="bg-white p-3 rounded-b-md fixed top-0 right-0 left-0 z-20">
      {notifications.map((notif) => (
        <div key={id}>
          <p>{notif.title}</p>
        </div>
      ))}
    </div>
  );
};

export default Notification;
