import { motion } from "framer-motion";

const PopUpMonthViewWindow = ({ positions, eventsToRender }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        top: `${positions.y}px`,
        left: `${positions.x}px`,
        transform: "translate(-17vw, -17vh)",
      }}
      className={`absolute p-2 z-[900] bg-white shadow-lg rounded-md min-h-60 min-w-60`}
    >
      {eventsToRender && eventsToRender.length > 0 ? (
        eventsToRender.map((event) => <div key={event.id}></div>)
      ) : (
        <p>Add event</p>
      )}
    </motion.div>
  );
};

export default PopUpMonthViewWindow;
