import { motion } from "framer-motion";

const Color = ({ string, color, setColor, index }) => {
  const selected = color === string;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { delay: index / 14, duration: 0.18 },
      }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.96 }}
      onClick={() => setColor((prev) => (prev === string ? null : string))}
      className={[
        // base
        "relative m-1 h-8 w-8 rounded-full cursor-pointer select-none",
        "shadow-sm transition-all duration-200",
        "outline-none focus-visible:ring-2 focus-visible:ring-red-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white",

        // color class (your existing system)
        string,

        // modern surface polish
        "ring-1 ring-black/10 hover:ring-black/20",

        // selected state
        selected
          ? "ring-2 ring-red-500 shadow-md"
          : "hover:shadow-md",
      ].join(" ")}
      aria-pressed={selected}
      aria-label={`Select ${string.replace(/-/g, " ")}`}
    >
      {/* soft highlight (adds depth without changing your colors) */}
      <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/35 to-transparent" />

      {/* selected check */}
      {selected && (
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="pointer-events-none absolute inset-0 grid place-items-center"
        >
          <span className="h-4 w-4 rounded-full bg-white/90 shadow-sm grid place-items-center">
            <span className="block h-2 w-2 rounded-full bg-red-500" />
          </span>
        </motion.span>
      )}
    </motion.button>
  );
};

export default Color;
