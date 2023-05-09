import { useContext, useState } from "react";
import { motion } from "framer-motion";
import { RiMenuUnfoldFill } from "react-icons/ri";
import {
  BsFillArrowRightCircleFill,
  BsFillArrowLeftCircleFill,
  BsThreeDotsVertical,
} from "react-icons/bs";
import LoginLogout from "./LoginLogout";
import UserContext from "../context/UserContext";
import DatesContext from "../context/DatesContext";

const Header = () => {
  const { dt, setNav } = useContext(DatesContext);
  const { user } = useContext(UserContext);

  const [showLogin, setShowLogin] = useState(false);

  return (
    <motion.header
      initial={{ y: -200 }}
      animate={{ y: 0 }}
      className="flex justify-between p-5 mb-5 shadow-md shadow-purple-100"
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
      {user ? (
        <img
          src={user.avatarUrl}
          onClick={() => setShowLogin((prev) => !prev)}
          alt="user"
          className="w-[25px] h-[25px] rounded-full shadow-sm"
        />
      ) : (
        <BsThreeDotsVertical
          onClick={() => setShowLogin((prev) => !prev)}
          className="cursor-pointer"
        />
      )}
      {showLogin && <LoginLogout />}
    </motion.header>
  );
};

export default Header;
