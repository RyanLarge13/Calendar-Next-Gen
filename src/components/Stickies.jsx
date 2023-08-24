import { useContext } from "react";
import { motion } from "framer-motion";
import UserContext from "../context/UserContext";

const Stickies = () => {
  const { stickies, setStickies } = useContext(UserContext);

  return (
    <>
      {stickies.map((sticky) => (
        <motion.div
          drag={true}
          dragConstraints={{
            top: 0,
            right: window.innerWidth - 100,
            left: 0,
            bottom: window.innerHeight - 100,
          }}
          className={`markdown z-[999] shadow-xl rounded-md fixed top-0 left-0 w-40 h-40 px-2 py-1 overflow-y-auto ${sticky.color}`}
        >
          <h2>{sticky.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: sticky.body }}></div>
        </motion.div>
      ))}
    </>
  );
};

export default Stickies;
