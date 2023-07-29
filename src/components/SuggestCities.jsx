// import React, { useState, useEffect } from "react";
//
// const SuggestCities = () => {
//   const [selectedPlace, setSelectedPlace] = useState(null);
//   const [suggestions, setSuggestions] = useState([]);
//   const [map, setMap] = useState(null);
//
//   const handlePlaceSelect = (place) => {
//     setSelectedPlace(place);
//   };
//
//   useEffect(() => {
//     // Define the callback function to initialize the Autocomplete
//     const initAutocomplete = () => {
//       const input = document.getElementById("autocomplete-input");
//       const autocomplete = new window.google.maps.places.Autocomplete(input, {
//         types: ["(cities)", "establishment"],
//       });
//
//       autocomplete.addListener("place_changed", () => {
//         const place = autocomplete.getPlace();
//         if (place.name) {
//           handlePlaceSelect(place);
//         }
//       });
//     };
//
//     // Load the Google Maps JavaScript API script dynamically with the callback
//     const script = document.createElement("script");
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${
//       import.meta.env.VITE_GOOGLE_MAPS_API_KEY
//     }&libraries=places`;
//     script.onload = initAutocomplete;
//     document.head.appendChild(script);
//
//     return () => {
//       // Cleanup: Remove the Google Maps script when the component unmounts
//       document.head.removeChild(script);
//     };
//   }, []);
//
//   return (
//     <div>
//       <input
//         id="autocomplete-input"
//         placeholder="Type a city or business name"
//       />
//       <div>
//         {suggestions.map((suggestion, index) => (
//           <div
//             key={index}
//             style={{
//               backgroundColor: suggestion.active ? "#e3e3e3" : "#fff",
//               cursor: "pointer",
//             }}
//           >
//             {suggestion.description}
//           </div>
//         ))}
//       </div>
//       {selectedPlace && (
//         <div style={{ height: "400px", width: "100%" }} ref={setMap}>
//           {/* Map will be rendered here */}
//         </div>
//       )}
//     </div>
//   );
// };
//
// export default SuggestCities;
//

import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
  useLoadScript,
} from "@react-google-maps/api";
import debounce from "lodash.debounce";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // Replace with your Google Maps API key

const SuggestCities = () => {
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
        <div key={place.id} className="my-2 rounded-md p-2 shadow-sm" onClick={() => handleSelectPlace(place.id)}>
          {place.name}
        </div>
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
    libraries: ["places"],
  });

  if (loadError) {
    return <div>Error loading Google Maps API</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "400px" }}
      center={selectedPlace.coordinates}
      zoom={10}
    >
      <Marker position={selectedPlace.coordinates} />
    </GoogleMap>
  );
};

export default SuggestCities;
