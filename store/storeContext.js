import { createContext, useReducer } from "react";

export const StoreContext = createContext();

export const ACTION_TYPES = {
  SET_LATLONG: "SET_LATLONG",
  SET_COFFEE_SHOPS: "SET_COFFEE_SHOPS",
};

const storeReducer = (state, action) => {
  const { SET_COFFEE_SHOPS, SET_LATLONG } = ACTION_TYPES;
  switch (action.type) {
    case SET_LATLONG: {
      return { ...state, latLong: action.payload.latLong };
    }
    case SET_COFFEE_SHOPS: {
      return { ...state, coffeeShops: action.payload.coffeeShops };
    }
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const StoreProvider = ({ children }) => {
  const initialState = {
    latLong: "",
    coffeeShops: [],
  };

  const [state, dispatch] = useReducer(storeReducer, initialState);
  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
