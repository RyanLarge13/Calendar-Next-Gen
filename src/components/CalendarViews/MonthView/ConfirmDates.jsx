const ConfirmDates = () => {
  const confirmDates = false;

  return (
    confirmDates && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-20 p-2 left-[50%] translate-x-[-50%] bg-white shadow-lg rounded-md flex justify-between items-center gap-x-20"
      >
        <button
          className="text-lg p-3 rounded-md bg-slate-200"
          onClick={() => {
            setLongPressActive(false);
            setLongPressTimeout(null);
            setSelected([]);
          }}
        >
          <AiFillCloseCircle />
        </button>
        <button
          className="text-lg p-3 rounded-md bg-slate-200"
          onClick={() => addNewTypeWithDays()}
        >
          <AiFillCheckCircle />
        </button>
      </motion.div>
    )
  );
};

export default ConfirmDates;
