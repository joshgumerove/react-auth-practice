import React, { useState } from "react";

// const AuthContext = React.createContext({
//   token: "",
//   isLoggedIn: false,
//   login: (token) => {},
//   logout: () => {},
// });

const AuthContext = React.createContext();

// do not need to do the above -- does more for autocomplete

const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const userIsLoggedIn = !!token; // converts to a boolean

  const loginHandler = (token) => {
    setToken(token);
  };

  const logoutHandler = () => {
    setToken(null);
  };

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
