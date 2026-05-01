import { useContext } from "react";
import UserContext from "../../context/UserContext";
import { TimerType } from "../../types/timers";
import Timer from "./Timer";
import Portal from "../Misc/Portal";

const Timers = (): JSX.Element => {
  const { timers } = useContext(UserContext) as { timers: TimerType[] };

  return (
    <div>
      {timers
        .filter((t: TimerType) => t.pinned)
        .map((t) => (
          <Portal key={t.id}>
            <Timer timer={t} />
          </Portal>
        ))}
    </div>
  );
};

export default Timers;
