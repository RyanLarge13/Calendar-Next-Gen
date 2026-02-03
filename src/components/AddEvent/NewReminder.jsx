import { useEffect, useState } from "react";
import { tailwindBgToHex } from "../../utils/helpers";
import Toggle from "../Toggle";

const NewReminder = ({ r, color, setNewReminders }) => {
  const [onlyNotify, setOnlyNotify] = useState(false);

  useEffect(() => {
    setNewReminders((prev) => {
      return prev.map((pr) => (pr.id === r.id ? { ...pr, onlyNotify } : pr));
    });
  }, [onlyNotify]);

  const removeReminder = () => {
    setNewReminders((prev) => {
      return prev.filter((pr) => pr.id !== r.id);
    });
  };

  return (
    <div className="mt-3 flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm font-medium">
        <AiFillInfoCircle />
        <span>Only notify</span>
      </div>
      <Toggle condition={onlyNotify} setCondition={setOnlyNotify} />
      <div className="mt-3 space-y-2">
        <p
          style={{ color: tailwindBgToHex(color) }}
          className={`${color} inline-flex items-center rounded-xl border border-black/10 px-3 py-1 text-xs font-semibold shadow-sm`}
        >
          {r.time}
        </p>
      </div>
      <button
        className="text-xs font-semibold text-white rounded-xl px-3 py-1.5 bg-gradient-to-tr from-red-500 to-rose-500 shadow-sm hover:brightness-110 active:scale-95 transition"
        onClick={removeReminder}
      >
        Delete
      </button>
    </div>
  );
};

export default NewReminder;
