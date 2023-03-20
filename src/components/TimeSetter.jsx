import { useState, useEffect } from "react";

const TimeSetter = () => {
  const [degrees, setDegrees] = useState(0);
  const [working, setWorking] = useState(false);

  //useEffect(() => {}, [degrees]);

  const move = (e) => {
     e.preventDefault();
    const rotation = e.touches[1];
    setDegrees(rotation);
    setWorking(true);
  };

  return (
    <div className="fixed bottom-0 rounded-t-md left-0 right-0 z-30 bg-white p-5 flex flex-col justify-center items-center shadow-lg">
      <p>AM : PM</p>
      {working && <p>Hi</p>}
      <div className="w-[400px] h-[400px] bg-red-100 relative">
        <div
          onTouchMove={(e) => move(e)}
          className={`w-[200px] h-[200px] bg-black origin-bottom-right rotate-[${degrees}deg] absolute top-0 left-0 z-10`}
        ></div>
        <div className="absolute w-full h-full rounded-full bg-blue-100 top-0"></div>
      </div>
    </div>
  );
};

export default TimeSetter;
