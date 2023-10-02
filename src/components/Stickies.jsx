import { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AiFillPushpin,
  AiFillCloseCircle,
  AiOutlinePushpin,
} from "react-icons/ai";
import { BiExpand } from "react-icons/bi";
import UserContext from "../context/UserContext";

const Stickies = () => {
  const { stickies, setStickies } = useContext(UserContext);

  return (
    <AnimatePresence>
      {stickies.map((sticky) => (
        <motion.div
          initial={{ scale: 0 }}
          exit={{ scale: 0 }}
          animate={{ scale: 1 }}
          drag={true}
          dragConstraints={{
            top: 0,
            right: window.innerWidth - 150,
            left: 0,
            bottom: window.innerHeight - 150,
          }}
          className={`markdown z-[999] shadow-xl rounded-md fixed top-0 left-0 w-40 h-40 overflow-y-auto ${sticky.color}`}
        >
          <div className="rounded-t-md bg-slate-100 shadow-md p-2 flex justify-between items-center">
            <div className="flex justify-between items-center gap-x-3">
              <AiOutlinePushpin />
              <BiExpand />
            </div>
            <div>
              <AiFillCloseCircle />
            </div>
          </div>

          <div className="p-2">
            <h2>{sticky.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: sticky.body }}></div>
          </div>
        </motion.div>
      ))}
      </AnimatePresence>
  );
};

export default Stickies;
