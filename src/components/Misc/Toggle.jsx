import { useContext } from "react";
import UserContext from "../context/UserContext";

const Toggle = ({ condition, setCondition, howOften }) => {
  const { preferences } = useContext(UserContext);

  return (
    <div
      onClick={() => {
        if (howOften) {
          return setCondition((prev) =>
            howOften === condition ? null : howOften
          );
        }
        setCondition && setCondition((prev) => !prev);
      }}
      className={`bg-gradient-to-tr ${
        preferences.darkMode
          ? "from-[#222] to-[#444]"
          : "from-white to-slate-100"
      } ml-3 flex justify-center items-center relative w-[50px] h-[25px] shadow-md rounded-full cursor-pointer`}
    >
      <div
        className={`absolute top-[1px] bottom-[1px] duration-200 ${
          !howOften
            ? condition
              ? "right-[1px] left-[50%] bg-gradient-to-tr from-green-200 to-emerald-400 scale-[1.05]"
              : "left-[1px] right-[50%] bg-gradient-to-tr from-red-200 to-rose-400"
            : howOften && howOften === condition
            ? "right-[1px] left-[50%] bg-gradient-to-tr from-green-200 to-emerald-400 scale-[1.05]"
            : "left-[1px] right-[50%] bg-gradient-to-tr from-red-200 to-rose-400"
        } rounded-full`}
      ></div>
    </div>
  );
};

export default Toggle;
