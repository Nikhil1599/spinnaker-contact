import { createContext, useEffect, useReducer } from "react";

const initialState = {
  token: localStorage.getItem("token") || null,
};

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        token: action.payload.token,
      };
    case "LOGOUT":
      return { ...state, token: null };
    default:
      return state;
  }
};

// eslint-disable-next-line react/prop-types
const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  useEffect(() => {
    localStorage.setItem("token", state.token);
  }, [state]);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
