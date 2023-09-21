import { useContext, useRef, useState, useEffect } from "react";
import { staticMonths, staticYears } from "../constants.js";
import { motion } from "framer-motion";
import InteractiveContext from "../context/InteractiveContext";

const DatePicker = () => {
  const { setShowDatePicker } = useContext(InteractiveContext);

  const scrollContainerRef = useRef(null);
  
  const [closestElement, setClosestElement] = useState(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    const handleScroll = () => {
      const scrollY = scrollContainer.scrollTop;
      const elements = Array.from(scrollContainer.querySelectorAll(".snap-element"));

      // Find the element that is closest to being fully in view
      let closest = null;
      let minDistance = Infinity;

      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const distance = Math.abs(rect.top);

        if (distance < minDistance) {
          minDistance = distance;
          closest = element;
        }
      });

      // Set the closest element
      setClosestElement(closest);
    };

    // Attach the scroll event listener
    scrollContainer.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Function to snap the closest element into view
  const snapToClosestElement = () => {
    if (closestElement) {
      closestElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
        onClick={() => setShowDatePicker(false)}
      ></div>
      <div className="fixed top-40 left-[50%]  translate-x-[-50%] rounded-md shadow-md bg-white p-5">
        <div className="flex">
          <div className="">
            <h2 className="text-lg">Month</h2>
            <div
              className="overflow-y-scroll max-h-[60px] text-[40px] scrollbar-hide"
              ref={scrollContainerRef}
            >
              {staticMonths.map((mon) => (
                <motion.div
                  key={mon}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  className="pb-4 snap-element"
                >
                  {mon.name}
                </motion.div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg">Year</h2>
            <div className="overflow-y-scroll max-h-[60px] text-[40px] scrollbar-hide">
              {staticYears.map((stYr) => (
                <motion.div
                  key={stYr}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  className="pb-4"
                >
                  {stYr}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-5 border-t p-3">
          <button type="text" onClick={() => setShowDatePicker(false)}>
            Cancel
          </button>
          <button type="text">Okay</button>
        </div>
      </div>
    </>
  );
};

export default DatePicker;
