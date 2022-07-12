import { useState, useContext } from "react";
import { ACTION_TYPES, StoreContext } from "../store/storeContext";

const useTrackedLocation = () => {
  const [locationErrorMessage, setLocationErrorMessage] = useState("");
  // const [latLong, setLatLong] = useState("");
  const [isFindingLocation, setIsFindingLocation] = useState(false);

  const { dispatch } = useContext(StoreContext);

  // note: refer to geolocation API docs
  const success = position => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    // setLatLong(`${latitude},${longitude}`);

    dispatch({
      type: ACTION_TYPES.SET_LATLONG,
      payload: { latLong: `${latitude},${longitude}` },
    });
    setLocationErrorMessage("");
    setIsFindingLocation(false);
  };

  const error = () => {
    setIsFindingLocation(false);
    setLocationErrorMessage("Unable to retrieve your location.");
  };

  const handleTrackLocation = () => {
    setIsFindingLocation(true);
    if (!navigator.geolocation) {
      setLocationErrorMessage("Geolocation is not supported by your browser.");
      setIsFindingLocation(false);
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return {
    // latLong,
    handleTrackLocation,
    locationErrorMessage,
    isFindingLocation,
  };
};

export default useTrackedLocation;
