import React from "react";

const Color = ({ string, color, setColor }) => {
  return (
    <div
      onClick={() => setColor((prev) => (prev === string ? null : string))}
      className={`${string} w-[20px] h-[20px] rounded-full shadow-sm m-2 duration-200 cursor-pointer ${
        color === string && "opacity-60 shadow-md shadow-black scale-110"
      }`}
    ></div>
  );
};

export default Color;
