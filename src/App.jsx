import { useState, useEffect } from "react";
import { RiMenuUnfoldFill } from "react-icons/ri";
import {
  BsFillArrowRightCircleFill,
  BsFillArrowLeftCircleFill,
  BsThreeDotsVertical,
} from "react-icons/bs";
import Calendar from "./components/Calendar";

const App = () => {
  const [nav, setNav] = useState(0);
  const [dt, setDt] = useState(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const updatedDate = new Date();
    updatedDate.setMonth(new Date().getMonth() + nav);
    setDt(updatedDate);
    setLoading(false);
  }, [nav]);

  return (
    <>
      <header className="flex justify-between p-5 mb-5 shadow-md">
        <RiMenuUnfoldFill />
        <div className="flex justify-center items-center">
          <BsFillArrowLeftCircleFill
            onClick={() => setNav((prev) => prev - 1)}
            className="text-xl"
          />
          <p className="mx-5">{`${dt.toLocaleString("default", {
            month: "long",
          })} ${dt.getFullYear()}`}</p>
          <BsFillArrowRightCircleFill
            onClick={() => setNav((prev) => prev + 1)}
            className="text-xl"
          />
        </div>
        <BsThreeDotsVertical />
      </header>
      {!loading && <Calendar date={dt} />}
    </>
  );
};

export default App;
