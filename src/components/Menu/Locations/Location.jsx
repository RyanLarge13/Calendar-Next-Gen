import { useContext, useEffect, useState } from "react";
import UserContext from "../../../context/UserContext";
import { MdAddLocation, MdOutlineLocationOn } from "react-icons/md";
import SearchLocation from "./SearchLocation";
import { H_FetchWeather } from "../../../utils/helpers";

const Location = () => {
  const { preferences, location, usersLocations, setLocation, setWeatherData } =
    useContext(UserContext);

  const checkMatchingLocation = (l) => {
    return location.city === l.city && location.state === l.state;
  };

  const changeWeather = async (l) => {
    if (checkMatchingLocation(l)) {
      return;
    }

    setLocation(l);

    const newWeatherData = await H_FetchWeather(l.lng, l.lat);

    setWeatherData(newWeatherData);
  };

  return (
    <div
      className={`
                  rounded-3xl border shadow-sm transition-all
                  ${
                    preferences.darkMode
                      ? "bg-white/5 border-white/10 hover:bg-white/7"
                      : "bg-white border-black/10 hover:bg-black/[0.02]"
                  }
            `}
    >
      <div
        className={`flex justify-between items-center px-5 py-4 border-b ${
          preferences.darkMode ? "border-white/10" : "border-black/10"
        }`}
      >
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <span
            className={`
                    grid place-items-center h-9 w-9 rounded-2xl border shadow-sm
                    ${
                      preferences.darkMode
                        ? "bg-slate-500/15 border-white/10 text-white/80"
                        : "bg-slate-50 border-black/10 text-slate-700"
                    }
                  `}
          >
            <MdOutlineLocationOn className="text-lg" />
          </span>
          Location
        </h2>
      </div>

      {location.city && location.state ? (
        <div className="p-5">
          <p
            className={`text-sm font-semibold ${
              preferences.darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            {location.city}, {location.state}
          </p>
          <p
            className={`text-xs mb-3 ${
              preferences.darkMode ? "text-white/60" : "text-slate-500"
            }`}
          >
            based on your computed location
          </p>
          <div className="mt-5">{/* Add list of locations for the user */}</div>
        </div>
      ) : (
        <div>
          <p
            className={`text-[11px] p-5 pb-0 font-semibold tracking-wide ${
              preferences.darkMode ? "text-white/60" : "text-slate-500"
            }`}
          >
            No location was provided
          </p>
        </div>
      )}
      <p
        className={`text-xs ml-5 flex items-center ${
          preferences.darkMode ? "text-white/60" : "text-slate-500"
        }`}
      >
        Add Another Location{" "}
        <MdAddLocation className="text-lime-300 ml-3 text-xl" />
      </p>
      <SearchLocation />

      {/* List of cities user is querying weather from */}
      <div className="mt-10">
        <p
          className={`text-xs ml-5 mb-2 flex items-center ${
            preferences.darkMode ? "text-white/60" : "text-slate-500"
          }`}
        >
          Your Places...
        </p>
        <div className="flex flex-col">
          {usersLocations.map((l, index) => (
            <button
              key={index}
              className={`
                  rounded-xl m-2 p-5 border text-start shadow-sm transition-all
                  ${
                    preferences.darkMode
                      ? "bg-white/5 border-white/10 hover:bg-white/7"
                      : "bg-white border-black/10 hover:bg-black/[0.02]"
                  } ${checkMatchingLocation(l) ? "border-cyan-300" : ""}
            `}
              onClick={() => changeWeather(l)}
            >
              <p
                className={`text-sm font-semibold ${
                  preferences.darkMode ? "text-white" : "text-slate-900"
                }`}
              >
                {l.city}, {l.state}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Location;
