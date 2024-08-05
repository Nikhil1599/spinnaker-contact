import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Auth/AuthContext";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const { state } = useContext(AuthContext);
  const token = state.token; // or state.user.token depending on your context structure

  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
