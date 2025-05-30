import { motion } from "framer-motion";

const Color = ({ string, color, setColor, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileHover={{ scale: 1.1, transition: { delay: 0 } }}
      animate={{ opacity: 1, transition: { delay: index / 10 } }}
      onClick={() => setColor(prev => (prev === string ? null : string))}
      className={`${string} w-[30px] h-[30px] rounded-md m-[5px] duration-200 cursor-pointer shadow-md ${
        color === string && "opacity-60 shadow-lg scale-125"
      }`}
    ></motion.div>
  );
};

export default Color;
