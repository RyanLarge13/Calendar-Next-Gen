import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import debounce from "lodash.debounce";
import GoogleMaps from "./GoogleMaps";
import UserContext from "../context/UserContext";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const SuggestCities = ({ setLocationObject, placeholder, showGoogleMap }) => {
  const { preferences } = useContext(UserContext);

  const [inputValue, setInputValue] = useState("");
  const [suggestionRenders, setSuggestionRenders] = useState([]);
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
        setSuggestionRenders([]);
      };
      document.head.appendChild(script);
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    fetchSuggestions(value);
  };

  const fetchSuggestions = debounce(async (value) => {
    if (!value?.trim()) {
      return;
    }

    if (window.google) {
      const { AutocompleteSuggestion } =
        await google.maps.importLibrary("places");

      const { suggestions } =
        await AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: value,
          language: "en-US",
          region: "us",
        });

      const suggestionsToShow = [];

      for (const s of suggestions) {
        const p = s.placePrediction;

        if (!p) continue;

        const newSuggestedPlace = {
          placeId: p.placeId,
          text: p.text?.text, // full display text
          main: p.mainText?.text,
          secondary: p.secondaryText?.text,
          types: p.types,
        };

        suggestionsToShow.push(newSuggestedPlace);
      }

      setSuggestionRenders(suggestionsToShow);
    }
  }, 300);

  const handleSelectPlace = async (placeId) => {
    if (window.google) {
      const { Place } = await google.maps.importLibrary("places");

      const place = await new Place({ id: placeId });

      await place.fetchFields({
        fields: [
          "displayName",
          "formattedAddress",
          "location",
          "addressComponents",
        ],
      });

      const officialSelectedPlace = {
        address: place.formattedAddress,
        latLng: place.location?.toJSON?.() ?? place.location,
      };

      if (place && officialSelectedPlace) {
        setSelectedPlace({
          id: placeId,
          string: officialSelectedPlace.address,
          coordinates: {
            lat: officialSelectedPlace.latLng.lat,
            lng: officialSelectedPlace.latLng.lng,
          },
        });
        setLocationObject({
          id: placeId,
          string: officialSelectedPlace.address,
          coordinates: {
            lat: officialSelectedPlace.latLng.lat,
            lng: officialSelectedPlace.latLng.lng,
          },
        });
        setInputValue(officialSelectedPlace.address);
        setSuggestionRenders([]);
      }
    }
  };

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={`${
          preferences.darkMode ? "bg-[#444] text-white" : "bg-white text-black"
        } my-2 p-2 rounded-md shadow-sm w-full focus:outline-none outline-none focus:shadow-md duration-200`}
      />
      <div className="my-3">
        {suggestionRenders.map((place) => (
          <motion.div
            whileHover={{ backgroundColor: "#eee" }}
            key={place.placeId}
            className={`my-2 rounded-md p-2 shadow-sm cursor-pointer`}
            onClick={() => handleSelectPlace(place.placeId)}
          >
            {place.text}
          </motion.div>
        ))}
      </div>
      {selectedPlace && showGoogleMap ? (
        <div>
          <GoogleMaps coordinates={selectedPlace.coordinates} />
        </div>
      ) : null}
    </div>
  );
};

export default React.memo(SuggestCities);
