import { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
  useLoadScript,
} from "@react-google-maps/api";
import debounce from "lodash.debounce";
import { motion } from "framer-motion";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ["places"];

const SuggestCities = ({ setLocationString }) => {
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
          setLocationString(place.formatted_address);
        }
      });
    }
  };

  return (
    <div>
      <Autocomplete
        onLoad={(autocomplete) => {
          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (place) {
              handleSelectPlace(place.place_id);
            }
          });
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type a city or place"
          className="my-2 p-2 rounded-sm shadow-sm w-full focus:outline-gray-200"
        />
      </Autocomplete>
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
          <MapComponent selectedPlace={selectedPlace} />
        </div>
      ) : (
        <div>No place selected</div>
      )}
    </div>
  );
};

const MapComponent = ({ selectedPlace }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: libraries,
  });

  if (loadError) {
    return <div>Error loading Google Maps API</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={{
        width: "100%",
        height: "400px",
        borderRadius: "15px",
        boxShadow: "0 10px 50px 0 #eee",
      }}
      center={selectedPlace.coordinates}
      zoom={10}
    >
      <Marker position={selectedPlace.coordinates} zIndex={900} />
    </GoogleMap>
  );
};

export default SuggestCities;
