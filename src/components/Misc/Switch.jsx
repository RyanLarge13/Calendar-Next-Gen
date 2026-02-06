import React, { useContext } from "react";
import UserContext from "../../context/UserContext";

const Switch = ({ title, styles, value, toggle }) => {
  const { preferences } = useContext(UserContext);
  return (
    <button
      onClick={() => toggle(!value)}
      className={`${styles} flex w-full items-center justify-between`}
    >
      <p>{title}</p>
      <div
        className={`relative h-[20px] w-[40px] rounded-full shadow-md bg-gradient-to-tr ${
          preferences.darkMode
            ? "from-[#222] to-[#444]"
            : "from-white to-slate-100"
        }`}
      >
        <div
          className={`absolute top-[1px] bottom-[1px] duration-200 rounded-full ${
            value
              ? "right-[1px] left-[50%] bg-gradient-to-tr from-green-200 to-emerald-400 scale-[1.05]"
              : "left-[1px] right-[50%] bg-gradient-to-tr from-red-200 to-rose-400"
          }`}
        ></div>
      </div>
    </button>
  );
};

export default Switch;
