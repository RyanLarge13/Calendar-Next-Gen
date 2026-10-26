import { useContext, useEffect, useState } from "react";
import UserContext from "../../../context/UserContext";
import { MdAddLocation, MdOutlineLocationOn } from "react-icons/md";
import SearchLocation from "./SearchLocation";
import { H_FetchWeather } from "../../../utils/helpers";

const Location = () => {
  const {
    preferences,
    location,
    usersLocations,
    setUsersLocations,
    localDB,
    setLocation,
    setWeatherData,
  } = useContext(UserContext);

  const [removeError, setRemoveError] = useState("");
  const [removing, setRemoving] = useState(null);

  const removeLocation = async (item, index) => {
    if (!localDB) {
      setRemoveError("Local storage is not ready. Try again shortly.");
      return;
    }
    setRemoving(index);
    setRemoveError("");
    const remaining = usersLocations.filter((_, i) => i !== index);
    try {
      await localDB.setUserLocations(remaining);
      setUsersLocations(remaining);
      if (checkMatchingLocation(item)) {
        const replacement = remaining[0];
        if (replacement) await changeWeather(replacement);
      }
    } catch (error) {
      setRemoveError("Could not remove the saved location. Please try again.");
    } finally {
      setRemoving(null);
    }
  };

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
        <h2 className="flex items-center gap-2 font-semibold text-sm">
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
        <MdAddLocation className="ml-3 text-lime-300 text-xl" />
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
          {removeError && (
            <p role="alert" className="px-4 text-red-500 text-sm">
              {removeError}
            </p>
          )}
          {usersLocations.map((l, index) => (
            <div key={index} className="flex items-center gap-2 mx-2 my-1">
              <button
                className={`
                  flex-1 rounded-3xl p-5 mb-2 border text-start shadow-sm transition-all
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
              <button
                type="button"
                disabled={removing !== null}
                onClick={() => removeLocation(l, index)}
                aria-label={`Remove ${l.city}, ${l.state}`}
                className="disabled:opacity-50 px-3 py-3 border border-red-400/40 rounded-xl text-red-500 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Location;
