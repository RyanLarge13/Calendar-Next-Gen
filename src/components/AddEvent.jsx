import { useState, useContext } from "react";
import { colors } from "../constants";
import DatesContext from "../context/DatesContext";
import Color from "./Color";
import UserContext from "../context/UserContext";

const AddEvent = ({ setAddNewEvent }) => {
  const { events, setEvents } = useContext(UserContext);
  const { string, setModal } = useContext(DatesContext);

  const [eventText, setEventText] = useState("");
  const [color, setColor] = useState(null);

  const addEvent = () => {};

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-wrap justify-center items-center my-10 mx-auto w-[80%]">
        {colors.map((item, index) => (
          <Color
            key={index}
            string={item.color}
            color={color}
            setColor={setColor}
          />
        ))}
      </div>
      <input
        placeholder="New Event"
        onChange={(e) => setEventText(e.target.value)}
        className={`p-2 rounded-md m-2 mt-10 text-center shadow-md ${color} outline-none bg-opacity-30 duration-200`}
      />
      <div className="flex justify-around p-2 mt-10 w-full">
        <button
          onClick={() => setAddNewEvent(false)}
          className="px-5 py-2 rounded-md shadow-md bg-gradient-to-r from-red-300 to-red-200 w-[100px]"
        >
          Cancel
        </button>
        <button
          onClick={() => addEvent()}
          className="px-5 py-2 rounded-md shadow-md bg-gradient-to-r from-green-300 to-green-200 w-[100px]"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddEvent;
