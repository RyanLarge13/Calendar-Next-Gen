const Toggle = ({ condition, setCondition, howOften }) => {
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
      className="ml-3 flex justify-center items-center relative w-[50px] h-[25px] shadow-md rounded-full cursor-pointer"
    >
      <div
        className={`absolute top-[1px] bottom-[1px] duration-200 ${
          !howOften
            ? condition
              ? "right-[1px] left-[50%] bg-green-200"
              : "left-[1px] right-[50%] bg-red-200"
            : howOften && howOften === condition
            ? "right-[1px] left-[50%] bg-green-200"
            : "left-[1px] right-[50%] bg-red-200"
        } rounded-full`}
      ></div>
    </div>
  );
};

export default Toggle;
