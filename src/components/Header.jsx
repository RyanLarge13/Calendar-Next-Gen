import { useContext } from "react";
import { motion } from "framer-motion";
import { RiMenuUnfoldFill } from "react-icons/ri";
import {
  BsFillArrowRightCircleFill,
  BsFillArrowLeftCircleFill,
  BsThreeDotsVertical,
} from "react-icons/bs";
import UserContext from "../context/UserContext";
import InteractiveContext from "../context/InteractiveContext";
import DatesContext from "../context/DatesContext";
import MenuNavigation from "./MenuNavigation";

const Header = () => {
  const { dt, setNav, theDay, setTheDay, currentWeek, setWeekOffset } =
    useContext(DatesContext);
  const { user, preferences, notifications } = useContext(UserContext);
  const { menu, setShowDatePicker, setMenu, setShowLogin, view } =
    useContext(InteractiveContext);

  const changeDay = (operand) => {
    const newDay = new Date(theDay);
    if (operand === "minus") {
      newDay.setDate(newDay.getDate() - 1);
    }
    if (operand === "plus") {
      newDay.setDate(newDay.getDate() + 1);
    }
    if (newDay.getMonth() !== theDay.getMonth()) {
      if (operand === "plus") {
        newDay.setMonth(theDay.getMonth() + 1);
      } else if (operand === "minus") {
        newDay.setMonth(theDay.getMonth() - 1);
      }
      if (newDay.getFullYear() !== theDay.getFullYear()) {
        if (operand === "plus") {
          newDay.setYear(theDay.getFullYear() + 1);
        } else if (operand === "minus") {
          newDay.setYear(theDay.getFullYear() - 1);
        }
      }
    }
    setTheDay(newDay);
  };

  return (
    <>
      {menu ? (
        <MenuNavigation />
      ) : (
        <header
          className={`${
            preferences.darkMode
              ? "bg-[#222] text-white"
              : "bg-white text-black"
          } fixed top-0 left-0 right-0 z-[10] flex justify-between px-5 py-4 shadow-lg rounded-b-lg`}
        >
          <button
            onClick={() => {
              setShowLogin(false);
              setMenu(true);
            }}
          >
            <RiMenuUnfoldFill />
          </button>
          {view === "month" && (
            <div className="flex justify-between items-center w-60">
              <BsFillArrowLeftCircleFill
                onClick={() => setNav((prev) => prev - 1)}
                className="text-xl cursor-pointer"
              />
              <h1
                className="mx-5 cursor-pointer"
                onClick={() => setShowDatePicker(true)}
              >
                {dt.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h1>
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
              <h1 className="mx-5">
                {theDay.toLocaleDateString("en-us", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </h1>
              <BsFillArrowRightCircleFill
                onClick={() => changeDay("plus")}
                className="text-xl cursor-pointer"
              />
            </div>
          )}
          {view === "week" && (
            <div className="flex flex-col justify-center items-center gap-y-1">
              <h2 className="text-[14px] font-semibold">
                {currentWeek[0].toLocaleDateString("en-US", {
                  year: "numeric",
                })}
              </h2>
              <div className="flex justify-center items-center">
                <BsFillArrowLeftCircleFill
                  onClick={() => setWeekOffset((prev) => prev - 1)}
                  className="text-xl cursor-pointer"
                />
                <h1 className="mx-5 text-[12px]">
                  {currentWeek[0].toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  -{" "}
                  {currentWeek[currentWeek.length - 1].toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric" }
                  )}
                </h1>
                <BsFillArrowRightCircleFill
                  onClick={() => setWeekOffset((prev) => prev + 1)}
                  className="text-xl cursor-pointer"
                />
              </div>
            </div>
          )}
          <div className="w-[25px] h-[25px]">
            {user ? (
              <>
                <img
                  src={user.avatarUrl}
                  onClick={() => {
                    setMenu(false);
                    setShowLogin((prev) => !prev);
                  }}
                  alt="user"
                  className="w-[25px] h-[25px] rounded-full cursor-pointer shadow-md"
                />
                {notifications.length > 0 ? (
                  <div
                    className={`absolute flex justify-center items-center top-4 right-4 rounded-full shadow-md w-[9px] h-[9px] bg-red-300 text-[12px]`}
                  ></div>
                ) : null}
              </>
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
        </header>
      )}
    </>
  );
};

export default Header;
