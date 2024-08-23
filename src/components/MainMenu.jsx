import { useContext } from "react";
import { motion } from "framer-motion";
import { formatDbText } from "../utils/helpers";
import { MdOutlineOpenInNew } from "react-icons/md";
import UserContext from "../context/UserContext";
import InteractiveContext from "../context/InteractiveContext";

const MainMenu = ({ timeOfDay }) => {
  const { user, upcoming } = useContext(UserContext);
  const { setEvent } = useContext(InteractiveContext);

  return (
    <motion.div
      initial={{ x: "-10%", opacity: 0 }}
      exit={{ x: "-10%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="pt-20 lg:px-40"
    >
      <h1 className="text-4xl pb-2 font-semibold">{timeOfDay}</h1>
      {user.username && <p className="ml-5 font-semibold">{user.username}</p>}
      <div className="px-5 mt-5 overflow-visible">
        <p className="text-sm">
          You have a few upcoming Events on your agenda this week
        </p>
        <div className="mt-3 lg:grid lg:grid-cols-2 lg:place-items-center lg:gap-5">
          {upcoming.length > 0 &&
            upcoming.map((event) => (
              <div
                key={event.id}
                className={`p-3 rounded-md shadow-lg my-5 lg:my-0 relative pl-5 w-full`}
              >
                <button
                  className="absolute top-0 right-0"
                  onClick={() => setEvent(event)}
                >
                  <MdOutlineOpenInNew />
                </button>
                <div
                  className={`${event.color} absolute left-0 top-0 bottom-0 w-2 rounded-md`}
                ></div>
                {event.diff < 1 && event.diff >= 0 ? (
                  <p className="text-2xl font-semibold mb-2">today</p>
                ) : event.diff >= 1 && event.diff < 2 ? (
                  <p className="text-2xl font-semibold mb-2">Tomorrow</p>
                ) : (
                  <p className="mb-2">
                    In{" "}
                    <span className="text-2xl font-semibold">{event.diff}</span>{" "}
                    days
                  </p>
                )}
                <p className="text-sm p-2font-semibold">{event.summary}</p>
                <div className="mt-3">
                  {formatDbText(event.description || "").map((text, index) => (
                    <p key={index} className="text-[14px] font-semibold">
                      {text}
                    </p>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MainMenu;
