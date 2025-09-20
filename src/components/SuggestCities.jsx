import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import debounce from "lodash.debounce";
import GoogleMaps from "./GoogleMaps";
import UserContext from "../context/UserContext";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const SuggestCities = ({ setLocationObject }) => {
  const { preferences } = useContext(UserContext);

  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    fetchScript();
  }, []);

  const fetchScript = () => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setSuggestions([]);
      };
      document.head.appendChild(script);
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    fetchSuggestions(value);
  };

  const fetchSuggestions = debounce((value) => {
    if (window.google) {
      const autocompleteService =
        new window.google.maps.places.AutocompleteService();

      autocompleteService.getPlacePredictions(
        { input: value },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setSuggestions(
              predictions.map((prediction) => ({
                id: prediction.place_id,
                name: prediction.description,
              }))
            );
          } else {
            setSuggestions([]);
          }
        }
      );
    }
  }, 300);

  const handleSelectPlace = (placeId) => {
    if (window.google) {
      const placesService = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );

      placesService.getDetails({ placeId }, (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setSelectedPlace({
            id: place.place_id,
            name: place.name,
            coordinates: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            },
          });
          setLocationObject({
            string: place.formatted_address,
            coordinates: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            },
          });
        }
      });
    }
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Type a city or place"
        className={`${
          preferences.darkMode ? "bg-[#444] text-white" : "bg-white text-black"
        } my-2 p-2 rounded-md shadow-sm w-full focus:outline-none outline-none focus:shadow-md duration-200`}
      />
      <div className="my-3">
        {suggestions.map((place) => (
          <motion.div
            whileHover={{ backgroundColor: "#eee" }}
            key={place.id}
            className={`${
              inputValue === place.name ? "bg-cyan-200" : "bg-white"
            } my-2 rounded-md p-2 shadow-sm cursor-pointer`}
            onClick={() => handleSelectPlace(place.id)}
          >
            {place.name}
          </motion.div>
        ))}
      </div>
      {selectedPlace ? (
        <div>
          <GoogleMaps coordinates={selectedPlace.coordinates} />
        </div>
      ) : null}
    </div>
  );
};

export default SuggestCities;
