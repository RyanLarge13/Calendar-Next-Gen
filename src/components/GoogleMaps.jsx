import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const libraries = ["places"];

const GoogleMaps = ({ coordinates }) => {
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
      center={coordinates}
      zoom={10}
    >
      <Marker position={coordinates} zIndex={900} />
    </GoogleMap>
  );
};

export default GoogleMaps;
