import { useContext, useEffect } from "react";
import DatesContext from "../context/DatesContext";

const WeekView = () => {
  const { currentWeek, setCurrentWeek } = useContext(DatesContext);

  useEffect(() => {
    console.log(currentWeek);
  }, []);

  return (
    <section>
      {currentWeek.map((date, index) => (
        <div key={index}>
          <p>{date.toLocaleDateString()}</p>
        </div>
      ))}
    </section>
  );
};

export default WeekView;
