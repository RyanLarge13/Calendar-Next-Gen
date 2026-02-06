import { useContext } from "react";
import { AnimatePresence } from "framer-motion";
import Sticky from "./Sticky";
import UserContext from "../../context/UserContext";

const Stickies = () => {
  const { stickies } = useContext(UserContext);

  return (
    <AnimatePresence>
      {stickies.map((sticky, index) => (
        <Sticky key={sticky.id} sticky={sticky} index={index} />
      ))}
    </AnimatePresence>
  );
};

export default Stickies;
