import { useState } from "react";
import { GoogleMap, LoadScript, Autocomplete } from "@react-google-maps/api";

const SuggestCities = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Handle suggestion selection
  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Autocomplete
        onLoad={(autocomplete) => {
          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (place.name) {
              handlePlaceSelect(place);
            }
          });
        }}
        options={{ types: ["(cities)", "establishment"] }} // Filter by cities and businesses (establishments)
        onPlaceChanged={() => {
          // Get the predictions from the autocomplete service
          const predictions = document.getElementsByClassName("pac-item");
          const suggestionList = [];
          for (let i = 0; i < predictions.length; i++) {
            suggestionList.push(predictions[i].textContent);
          }
          setSuggestions(suggestionList);
        }}
      >
        {({
          getInputProps,
          suggestions: autocompleteSuggestions,
          getSuggestionItemProps,
        }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: "Type a city or business name",
              })}
            />
            <div>
              {autocompleteSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  {...getSuggestionItemProps(suggestion)}
                  style={{
                    backgroundColor: suggestion.active ? "#e3e3e3" : "#fff",
                    cursor: "pointer",
                  }}
                >
                  {suggestion.description}
                </div>
              ))}
            </div>
          </div>
        )}
      </Autocomplete>
      {selectedPlace && (
        <GoogleMap
          mapContainerStyle={{ height: "400px", width: "100%" }}
          center={selectedPlace.geometry.location}
          zoom={14}
        >
          {/* Add any additional components or features to the map */}
        </GoogleMap>
      )}
    </LoadScript>
  );
};

export default SuggestCities;
