import { motion } from "framer-motion";

const Color = ({ string, color, setColor, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: index / 10 } }}
      onClick={() => setColor((prev) => (prev === string ? null : string))}
      className={`${string} w-[20px] h-[20px] rounded-full shadow-sm m-2 duration-200 cursor-pointer ${
        color === string && "opacity-60 shadow-md shadow-black scale-110"
      }`}
    ></motion.div>
  );
};

export default Color;
