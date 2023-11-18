import { useContext } from "react";
import { AnimatePresence } from "framer-motion";
import Sticky from "./Sticky";
import UserContext from "../context/UserContext";

const Stickies = () => {
  const { stickies } = useContext(UserContext);

  return (
    <AnimatePresence>
      {stickies.map((sticky) => (
        <Sticky key={sticky.id} sticky={sticky} />
      ))}
    </AnimatePresence>
  );
};

export default Stickies;
