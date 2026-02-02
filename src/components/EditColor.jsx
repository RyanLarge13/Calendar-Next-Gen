import { colors } from "../constants";
import Color from "./Color";

const EditColor = ({ save, color, setColor }) => {
  return (
    <div
      className={`
        absolute bottom-[110%] left-0 z-50
        rounded-2xl border shadow-xl p-3
        max-w-[280px]
        ${
          preferences.darkMode
            ? "bg-[#161616]/95 border-white/10"
            : "bg-white/95 border-black/10"
        }
        backdrop-blur-md
      `}
    >
      <p
        className={`text-xs font-semibold mb-2 ${
          preferences.darkMode ? "text-white/70" : "text-slate-600"
        }`}
      >
        Folder color
      </p>

      <div className="flex flex-wrap justify-center items-center">
        {colors.map((col, index) => (
          <Color
            key={index}
            string={col.color}
            color={color}
            setColor={setColor}
            index={index}
          />
        ))}
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={() => save()}
          className="
            rounded-2xl px-4 py-2 text-sm font-semibold text-white
            bg-gradient-to-tr from-red-500 to-rose-500
            shadow-md hover:shadow-lg hover:scale-[1.02]
            active:scale-[0.97] transition-all duration-200
          "
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditColor;
