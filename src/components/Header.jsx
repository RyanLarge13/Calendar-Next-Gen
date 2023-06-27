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
import InteractiveContext from "../context/InteractiveContext";
import DatesContext from "../context/DatesContext";

const Header = () => {
  const { dt, setNav, theDay, setTheDay } = useContext(DatesContext);
  const { user } = useContext(UserContext);
  const { setMenu, showLogin, setShowLogin, view } =
    useContext(InteractiveContext);

  return (
    <motion.header
      initial={{ y: -200 }}
      animate={{ y: 0 }}
      className="flex justify-between p-5 mb-5 shadow-md"
    >
      <RiMenuUnfoldFill
        onClick={() => {
          setShowLogin(false);
          setMenu((prev) => !prev);
        }}
        className="cursor-pointer"
      />
      {view === "month" && (
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
      )}
      {view === "day" && (
        <div className="flex justify-center items-center">
          <BsFillArrowLeftCircleFill
            onClick={() => setTheDay(new Date().setDate(new Date().getDate() - 1))}
            className="text-xl cursor-pointer"
          />
          <p className="mx-5">
            {new Date().toLocaleDateString("en-us", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <BsFillArrowRightCircleFill
            onClick={() => {}}
            className="text-xl cursor-pointer"
          />
        </div>
      )}
      <div className="w-[25px] h-[25px]">
        {user ? (
          <img
            src={user.avatarUrl}
            onClick={() => {
              setMenu(false);
              setShowLogin((prev) => !prev);
            }}
            alt="user"
            className="w-[25px] h-[25px] rounded-full cursor-pointer shadow-md"
          />
        ) : (
          <BsThreeDotsVertical
            onClick={() => {
              setMenu(false);
              setShowLogin((prev) => !prev);
            }}
            className="cursor-pointer"
          />
        )}
      </div>
      <LoginLogout />
    </motion.header>
  );
};

export default Header;
