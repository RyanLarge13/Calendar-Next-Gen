import { useContext } from "react";
import { motion } from "framer-motion";
import { RiMenuUnfoldFill, RiMenuFoldFill } from "react-icons/ri";
import {
  BsFillArrowRightCircleFill,
  BsFillArrowLeftCircleFill,
  BsThreeDotsVertical,
} from "react-icons/bs";
import LoginLogout from "./LoginLogout";
import UserContext from "../context/UserContext";
import InteractiveContext from "../context/InteractiveContext";
import DatesContext from "../context/DatesContext";
import MenuNavigation from "./MenuNavigation";

const Header = () => {
  const { dt, setNav, theDay, setTheDay, currentWeek } =
    useContext(DatesContext);
  const { user } = useContext(UserContext);
  const { menu, setMenu, setShowLogin, view } = useContext(InteractiveContext);

  const changeDay = (operand) => {
    if (operand === "minus") {
      const newDay = new Date();
      newDay.setDate(theDay.getDate() - 1);
      setTheDay(newDay);
    }
    if (operand === "plus") {
      const newDay = new Date();
      newDay.setDate(theDay.getDate() + 1);
      setTheDay(newDay);
    }
  };

  return (
    <>
      {menu ? (
        <MenuNavigation />
      ) : (
        <motion.header
          initial={{ y: -200 }}
          animate={{ y: 0 }}
          className="fixed top-0 left-0 right-0 bg-white z-[1] flex justify-between p-5 mb-5 shadow-md"
        >
          <RiMenuUnfoldFill
            onClick={() => {
              setShowLogin(false);
              setMenu(true);
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
                onClick={() => changeDay("minus")}
                className="text-xl cursor-pointer"
              />
              <p className="mx-5">
                {theDay.toLocaleDateString("en-us", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <BsFillArrowRightCircleFill
                onClick={() => changeDay("plus")}
                className="text-xl cursor-pointer"
              />
            </div>
          )}
          {view === "week" && (
            <div className="flex justify-center items-center">
              <BsFillArrowLeftCircleFill
                onClick={() => {}}
                className="text-xl cursor-pointer"
              />
              <p className="mx-5 text-[12px]">
                {currentWeek[0].toLocaleDateString()} -{" "}
                {currentWeek[currentWeek.length - 1].toLocaleDateString()}
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
      )}
    </>
  );
};

export default Header;
