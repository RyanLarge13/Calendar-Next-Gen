import { useContext } from "react";
import { motion } from "framer-motion";
import { RiMenuUnfoldFill } from "react-icons/ri";
import {
  BsFillArrowRightCircleFill,
  BsFillArrowLeftCircleFill,
  BsThreeDotsVertical,
} from "react-icons/bs";
import DatesContext from "../context/DatesContext";

const Header = () => {
  const { dt, setNav } = useContext(DatesContext);

  return (
    <motion.header
      initial={{ y: -200 }}
      animate={{ y: 0 }}
      className="flex justify-between p-5 mb-5 shadow-md"
    >
      <RiMenuUnfoldFill />
      <div className="flex justify-center items-center">
        <BsFillArrowLeftCircleFill
          onClick={() => setNav((prev) => prev - 1)}
          className="text-xl cursor-pointer"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-5"
        >{`${dt.toLocaleString("default", {
          month: "long",
        })} ${dt.getFullYear()}`}</motion.p>
        <BsFillArrowRightCircleFill
          onClick={() => setNav((prev) => prev + 1)}
          className="text-xl cursor-pointer"
        />
      </div>
      <BsThreeDotsVertical />
    </motion.header>
  );
};

export default Header;
