const Toggle = ({ condition, setCondition }) => {
  return (
    <div
      onClick={() => setCondition ? setCondition((prev) => !prev) : null}
      className="ml-3 flex justify-center items-center relative w-[50px] h-[25px] shadow-md rounded-full"
    >
      <div
        className={`absolute top-[1px] bottom-[1px] duration-200 ${
          condition
            ? "right-[1px] left-[50%] bg-green-200"
            : "left-[1px] right-[50%] bg-red-200"
        } rounded-full`}
      ></div>
    </div>
  );
};

export default Toggle;
