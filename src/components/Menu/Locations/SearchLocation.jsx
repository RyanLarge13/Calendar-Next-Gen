import { useContext } from "react";
import SuggestCities from "../../Misc/SuggestCities";
import UserContext from "../../../context/UserContext";
import { H_FetchWeather } from "../../../utils/helpers";

const SearchLocation = () => {
  const {
    location,
    usersLocations,
    setLocation,
    setUsersLocations,
    setWeatherData,
    localDB,
  } = useContext(UserContext);

  const checkMatchingLocation = (l) => {
    return location.city === l.city && location.state === l.state;
  };

  const addLocation = async (suggestedCitiesObject) => {
    console.log(suggestedCitiesObject);
    // Check if location is already in the locations array,
    // or if the current selected location is the same as the
    // new object

    if (suggestedCitiesObject === null) {
      return;
    }

    if (
      !suggestedCitiesObject.city ||
      !suggestedCitiesObject.state ||
      !suggestedCitiesObject.coordinates
    ) {
      return;
    }

    const city = suggestedCitiesObject.city;
    const state = suggestedCitiesObject.state;

    const coordinates = suggestedCitiesObject.coordinates;

    const lng = coordinates.lng;
    const lat = coordinates.lat;

    const newLocationObj = {
      city: city,
      state: state,
      lng: lng,
      lat: lat,
    };

    // First check if exists
    if (
      location.city === newLocationObj.city &&
      location.state === newLocationObj.state
    ) {
      return;
      // Show error notification user already has this location active
    }

    const includes = usersLocations.some(
      (l) => l.city === newLocationObj.city && l.state === newLocationObj.state,
    );

    const newLocationsToAdd = [...usersLocations, newLocationObj];

    if (includes) {
      if (checkMatchingLocation(location)) {
        return;
      }

      if (localDB) {
        localDB.setUserLocations(newLocationsToAdd);
      }
      setLocation(newLocationObj);
      return;
    }

    setLocation(newLocationObj);
    setUsersLocations(newLocationsToAdd);

    const newWeather = await H_FetchWeather(lng, lat);

    setWeatherData(newWeather);
  };

  return (
    <div className="px-5 text-sm">
      <SuggestCities
        setLocationObject={addLocation}
        placeholder={"Search An Address"}
        showGoogleMap={false}
      />
    </div>
  );
};

export default SearchLocation;
