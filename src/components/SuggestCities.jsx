import React, { useState, useEffect } from "react";

const SuggestCities = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [map, setMap] = useState(null);

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
  };

  useEffect(() => {
    // Define the callback function to initialize the Autocomplete
    const initAutocomplete = () => {
      const input = document.getElementById("autocomplete-input");
      const autocomplete = new window.google.maps.places.Autocomplete(input, {
        types: ["(cities)", "establishment"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.name) {
          handlePlaceSelect(place);
        }
      });
    };

    // Load the Google Maps JavaScript API script dynamically with the callback
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    }&libraries=places`;
    script.onload = initAutocomplete;
    document.head.appendChild(script);

    return () => {
      // Cleanup: Remove the Google Maps script when the component unmounts
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div>
      <input
        id="autocomplete-input"
        placeholder="Type a city or business name"
      />
      <div>
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            style={{
              backgroundColor: suggestion.active ? "#e3e3e3" : "#fff",
              cursor: "pointer",
            }}
          >
            {suggestion.description}
          </div>
        ))}
      </div>
      {selectedPlace && (
        <div style={{ height: "400px", width: "100%" }} ref={setMap}>
          {/* Map will be rendered here */}
        </div>
      )}
    </div>
  );
};

export default SuggestCities;
