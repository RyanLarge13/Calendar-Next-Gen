import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { colors } from "../constants";
import { MdLocationPin } from "react-icons/md";
import { FiRepeat } from "react-icons/fi";
import { IoIosAlarm } from "react-icons/io";
import { RiGalleryUploadFill } from "react-icons/ri";
import DatesContext from "../context/DatesContext";
import Color from "./Color";
import UserContext from "../context/UserContext";
import Toggle from "./Toggle";
import TimeSetter from "./TimeSetter";

const AddEvent = ({ setAddNewEvent }) => {
  const { setEvents, user, isOnline } = useContext(UserContext);
  const { string, setModal } = useContext(DatesContext);

  // Basic event data
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(null);
  // Location
  const [location, setLocation] = useState(false);
  const [locationString, setLocationString] = useState("");
  // reminders
  const [reminder, setReminder] = useState(false);
  const [reminderTimeString, setReminderTimeString] = useState("");
  const [when, setWhen] = useState(null);
  // repeats
  const [repeat, setRepeat] = useState(false);
  const [howOften, setHowOften] = useState(0);
  // attatchments
  const [attatchments, setAttachments] = useState([]);
  // start and end times with timezone
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeZone, setTimeZone] = useState(null);

  const addEvent = () => {
    if (!isOnline) {
    }
    if (isOnline) {
    }
    // const newEvent = {
    //   kind: "Event",
    //   summary,
    //   description,
    //   location,
    //   date: string,
    //   reminders: {
    //     reminder: true,
    //     reminderTimeString
    //     when,
    //   },
    //   repeats: {
    //     repeat: true,
    //     howOften: "biweekly",
    //     nextDate: next date
    //   },
    //   attatchments: [
    //     {
    //       type: "file",
    //       file: "file",
    //     },
    //   ],
    //   color,
    //   start: {
    //     startTime: new Date() + Number,
    //     timeZone,
    //   },
    //   end: {
    //     endTime: new Date() + Number,
    //     timeZone,
    //   },
    //   userId: user.id,
    // };
  };

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
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        className={`p-2 mt-10 mb-5 w-full text-center rounded-md shadow-md ${color} outline-none bg-opacity-30 duration-200`}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        id="description"
        cols="30"
        rows="10"
        className="p-3 w-full focus:outline-none rounded-md shadow-md"
      ></textarea>
      <div className="mt-10 w-full">
        <div className="w-full p-3 rounded-md shadow-md">
          <div className="flex justify-between items-center">
            <MdLocationPin />
            <Toggle condition={location} setCondition={setLocation} />
          </div>
          {location && (
            <motion.input
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              placeholder="Location"
              value={locationString}
              type="text"
              onChange={(e) => setLocationString(e.target.value)}
              className="mt-2 p-2 rounded-sm shadow-sm w-full focus:outline-gray-200"
            />
          )}
        </div>
        <div className="w-full p-3 my-5 rounded-md shadow-md">
          <div className="flex justify-between items-center">
            <FiRepeat />
            <Toggle condition={repeat} setCondition={setRepeat} />
          </div>
        </div>
        <div className="w-full p-3 rounded-md shadow-md">
          <div className="flex justify-between items-center">
            <IoIosAlarm />
            <Toggle condition={reminder} setCondition={setReminder} />
          </div>
          {reminder && (
            <TimeSetter
              setWhen={setWhen}
              setReminderTimeString={setReminderTimeString}
            />
          )}
        </div>
      </div>
      <div className="my-3 flex justify-center items-center w-full">
        <div className="w-full mr-1 p-3 rounded-md shadow-md">
          <p>Start</p>
        </div>
        <div className="w-full ml-1 p-3 rounded-md shadow-md">
          <p>End</p>
        </div>
      </div>
      <div className="mt-5">
        <label>
          <RiGalleryUploadFill className="text-xl" />
          <input type="file" className="w-0 h-0" />
        </label>
      </div>
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
