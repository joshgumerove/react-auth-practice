import React, { useState, useEffect, useCallback } from "react";

// const AuthContext = React.createContext({
//   token: "",
//   isLoggedIn: false,
//   login: (token) => {},
//   logout: () => {},
// });

let logoutTimer; // Global variable in this file (only)

const AuthContext = React.createContext();

// do not need to do the above -- does more for autocomplete

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();
  const remainingDuration = adjExpirationTime - currentTime;
  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpirationDate = localStorage.getItem("expirationTime");

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 3600) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
  };
};

const AuthContextProvider = ({ children }) => {
  const tokenData = retrieveStoredToken();
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }
  const [token, setToken] = useState(initialToken);

  const userIsLoggedIn = !!token; // converts to a boolean

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    // to clear token in localStorage

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []); // note the use of useCallback here (need to add if self-created in case of change)

  const loginHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem("token", token);
    localStorage.setItem("expirationTime", expirationTime);

    const remainingTime = calculateRemainingTime(expirationTime);

    logoutTimer = setTimeout(logoutHandler, remainingTime);
    // to persist user authentication  (can only store strings or numbers -- cannot store object)
  };

  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
export { AuthContextProvider };
