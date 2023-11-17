import { useContext, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Sticky from "./Sticky";
import UserContext from "../context/UserContext";

const Stickies = () => {
  const { stickies, setStickies } = useContext(UserContext);

  return (
      <AnimatePresence>
        {stickies.map((sticky) => (
          <Sticky sticky={sticky} />
        ))}
      </AnimatePresence>
  );
};

export default Stickies;
