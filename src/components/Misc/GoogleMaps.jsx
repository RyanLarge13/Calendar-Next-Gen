import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// IMPORTANT: advanced markers require the "marker" library (separate from "places")
const libraries = ["places", "marker"];

const GoogleMaps = ({ coordinates }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });

  const [map, setMap] = useState(null);
  const markerRef = useRef(null);

  // Create marker once when map is ready
  useEffect(() => {
    if (!isLoaded || !map || !coordinates || markerRef.current) return;

    // AdvancedMarkerElement is available when the "marker" library is loaded
    markerRef.current = new google.maps.marker.AdvancedMarkerElement({
      map,
      position: coordinates,
      // optional:
      // zIndex: 900,
      // title: "Selected location",
    });

    return () => {
      // cleanup on unmount / map change
      if (markerRef.current) {
        markerRef.current.map = null;
        markerRef.current = null;
      }
    };
  }, [isLoaded, map]);

  // Update marker position when coordinates change
  useEffect(() => {
    if (!markerRef.current || !coordinates) return;
    markerRef.current.position = coordinates;
  }, [coordinates]);

  if (loadError) return <div>Error loading Google Maps API</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={{
        width: "100%",
        height: "400px",
        borderRadius: "15px",
        boxShadow: "0 10px 50px 0 #eee",
      }}
      center={coordinates}
      zoom={10}
      onLoad={(m) => setMap(m)}
      onUnmount={() => setMap(null)}
      options={{
         mapId: import.meta.env.VITE_GOOGLE_MAP_ID
      }}
    />
  );
};

export default GoogleMaps;
