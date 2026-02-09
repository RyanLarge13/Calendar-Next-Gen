import { useState } from "react";

const SearchLocation = () => {
  const [suggestedCitiesObject, setSuggestedCitiesObject] = useState("");

  return (
    <div>
      <suggestedCities
        setLocationObj={setSuggestedCitiesObject}
        placeholder={"Search An Address"}
        showGoogleMap={false}
      />
    </div>
  );
};

export default SearchLocation;
